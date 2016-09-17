/*
http://www.bilibili.tv/video/av376363/ 特训弹幕游戏代码分析
http://jsfiddle.net/L4jrL/2/
源代码: http://jsfiddle.net/necrofantasia/eD6hj/
原作: http://homepage1.nifty.com/bee/tk/

希望此文能对所有高级弹幕君有帮助，如果有任何难以理解的地方请告诉我，我努力把那里改得易懂一些。
我个人研究的发现，可能有许多疏漏之处，也可能许多读者已经知道的信息。如果意见一致那是好事，如果发现我的疏漏请不吝教诲。
_______

研究代码时我一直看Adobe的参考手册，所有Actionscript本身的接口应该查看这个 http://help.adobe.com/zh_CN/FlashPlatform/reference/actionscript/3/

研究代码时适合对照bilibili的play.swf反汇编代码。Actionscript反汇编工具很多，暂时不再赘述，如果需要的话我加上。

在播放器高级弹幕调试窗口中获得任意对象的接口信息的方法：
    describe = $.root.loaderInfo.content.getDefinitionByName('flash.utils.describeType');
    trace(describe($));
执行，然后把xml复制出来查看。有时xml较大运行较慢，耐心。所有bilibili播放器本身的内部接口可以使用这个方法调查。

*/


/*
一切的起源，就是$.root.loaderInfo.content这个东西。
    trace($.root.loaderInfo.content);
    [object _MukioPlayerPlus_mx_managers_SystemManager]
它的接口可以用上面的方法查看。这里两个关键接口是create和getDefinitionByName。
create跟new作用完全一样，除了它是一个函数，而且它创建对象不能创建参数（只能有对象类型）。
getDefinitionByName跟import作用完全一样，除了它是一个函数，返回这个包里的类或者函数。
具体例子后面代码中会看到。

takeFocus的具体定义需要查看反汇编代码。它的作用主要是在游戏开始的时候把焦点切换到播放窗口中，因为一开始的时候焦点在其他地方（比如弹幕输入栏），绑定到播放窗口的键盘就收不到事件。
*/
var create = $.root.loaderInfo.content.create;
var Keyboard = $.root.loaderInfo.content.getDefinitionByName('flash.ui.Keyboard');
var takeFocus = $.root.loaderInfo.content.document.playerContainer.playerHolder.setFocus;

/*
从一个base64字符串中提取一个ByteArray。在代码中嵌入二进制数据就靠这个方法。

稍微好一点的是这里输入的base64字符串原来的数据是经过deflate压缩的，所以在base64解码一次之后还要解压缩一次。

需要注意的是，base64字符串中可以会出现/n这样的序列，这种序列在上传的时候会被转义导致解码损坏，所以需要在/和n之间换行。

mx.utils.Base64Decoder可以在Adobe文档中查到。

怎样生成这样一个base64字符串另起文说明。
*/
function extract(data) {
    var b64dec = create('mx.utils.Base64Decoder');
    b64dec.decode(data);
    var bytes = b64dec.toByteArray();
    bytes.inflate(); //inflate就是解压缩
    return bytes;
}

/*
参见 http://9ch.co/forum.php?mod=viewthread&tid=52965&page=1#pid435745
*/
function fixz(displayObject) {
    var x = displayObject.x;
    var y = displayObject.y;
    displayObject.transform.matrix3D = null;
    //上面那句话会改变x,y的值，所以要下面恢复
    displayObject.x = x;
    displayObject.y = y;
    return displayObject;
}

/* SWF_library source
类似API中的load()函数，我们可以从一个ByteArray中加载并执行任意SWF字节码。具体代码会在最后。这里先说一点原则问题。

执行任意代码就是魔盒，跟原声Flash程序没两样了。现在bilibili的播放器允许这个事情并不代表网站开发者不知道这个事情。个人理解在高级弹幕并不是一个优先级很高的特性的情况下，给普通开发者留有一定扩展余地而不是限制死了是个好事。

用户上传高级弹幕都有日志，字节码通过反汇编来做安全审计也是很容易的事情，所以这个事情需要高级弹幕君自律，不要滥用权利增加网站管理方的负担。

除了一些常识性的滥用，MukioPlayer的开发者aristotle9有几个告诫：修改播放器用户界面和播放器行为也是滥用。因为播放器的UI和行为是网站开发者既定的，如果作为一个用户去干扰了其他用户的正常使用，这显然不是什么光荣的事情，超出了应当的权利范围。

我不知道开发方是否有这种计划，开放某些用户提交Actionscript经审计后编译成库文件，然后可以用load函数从网站上加载，就免除了现在这种用ByteArray注射代码的不雅观，在技术上应该是一个比较理想的折中。
______

怎样生成库文件字节码我就不说了，该知道的人自然会知道。生成库文件字节码的时候要注意暴露的内部接口是否会被滥用。

下面是SWF_library这个字节码的源代码：

class ScriptKeyboardState extends Object {
    //必须私有，避免公开访问
    private var _stage:Stage;
    private var _jwplayer:JWPlayer;
    private var _isDown:Array;
    public function ScriptKeyboardState(_root:*) {
        _isDown = new Array(256);
        _stage = _root.stage;
        _jwplayer = _root.loaderInfo.content.document.playerContainer;
        _stage.addEventListener('keyDown', keyHandler);
        _stage.addEventListener('keyUp', keyHandler);
    }
    public static function getInstance(_root:*): ScriptKeyboardState {
        return new ScriptKeyboardState(_root);
    }
    public function isDown(key:int): Boolean {
        return _isDown[key] === true;
    }
    //这里必须只读，不能用来拦截播放器原生键盘映射
    //而且需要遵守播放器本来的焦点规则，焦点在弹幕输入栏的时候不能监听键盘事件。
    private function keyHandler(e:KeyboardEvent): void {
        if (e.keyCode >= 256)
            return;
        if (_stage.displayState == 'normal' && _jwplayer.getFocus() != _jwplayer.playerHolder)
            return;
        _isDown[e.keyCode] = (e.type == 'keyDown');
    }
}
function setStageFramerate(_root:*, framerate:Number): void {
    _root.stage.frameRate = framerate;
}
namespace ns="flash.display"; use namespace ns;
function createBitmapData(width:int, height:int, transparent:Boolean = true, fillColor:uint = 0xFFFFFFFF):BitmapData {
    return new BitmapData(width, height, transparent, fillColor);
}
*/
var SWF_library = extract('
TVLJbhtHEK1eZrqbi7iZFC2RsmgtNoeSwg8IEkWWtSCBg1gI7AspNMlueWxyhhiOZOuUwNfcA+Qb
lEOO+QxRBpRfyJH+gqSGioDMoapevapXXUUevDpRv3GAD8D+Bkj/CZAhsF+QAPB18QKJPOwA/ZnS
f/D7ieyA+33vrenHzjdRpC/dl+bs+Ycxj80kzn+55gexiQI9XE3wV/Ieqhd6ZCZj3Tfu+Lw39Pul
k37kj+NvzWUv1NHgJNaxEePIv0CvxlEY4wAzSJ+Z+DiYxDrAxlP0Z0advn0/HupLE4lTf7Ifvg/c
O8dwVuqduTzSwWCILIbPwoHJDPxJUj+f4AZhNNJDibIHYf98krlTOgqHAxPx+HJskrZELbXeD3Fw
dI57nkZhGDvz6alhqLH0OLChwILYBLEcoNIIg9yd2DNMaz8wUV4PBs8vkPjOn2ChiRzU/
nHsrvf9
wI8LExOfJJIHEZ4mSh734nzUM5GySeIlJmgwydqhnrzZ+W+HfD8ymN/z45Ee7+tYi70wHBod8PNk
+f/lK2TRlcRJVVOy6TBGqcsdBx1hrssoBl8IQgVhgnBBhWBSUCVYSlEieFrwjGBZlaKCLwieEzwv
WEGQosrTZSZ4ST2gaoGqMlU5qhapqlL1kApWU4yqGlV1qlaoekTVKlUNqh5TVUJ2Q5BNVSfqCRHs
qWCeIC1BttQ2lwQgCwQKBTSkhAaWKcA6oHmyARyJrW1P0nSa4H8RPyKkcoA5WQxhITE5wOI8dj8g
QDlTLjhcptA6Mk2SBpcjoNJFi6uizGYi5CF0ZSsJJVAGpHDd/ux0MjYz3SO3N5IeHWIzQ6I8J4q2
OLWlWX7z93sShwH5ISGntjwrbZM/ijjvsFOxFbs4K29Vrj56F8UCQLNTtdWDh5A4u3T168e7urli
eWqXZ4tbS1ferS6hcBOFmcuB/kI+O9deu5tt6Gyj2V1o6AV0uYbONZr1V96tV+vWprrWaF4fQ/26
3e4WO3Vbn7nbZI94f+niJ8ma3Upnxa7YR4grc1yd41XbsI/tGmarSXamkidvLXU27MbBOm3OUnO8
do8lPQRSSw7FCZ6ZXbfxjQ7DQ+aS1Z/eoFAzEcK067gAZTzXjt2Z3nzq8T3ed3qOdJKDCYq/0Nr8
mtJKr/0a6h6C+qD1RnQ2dx292WnturqFpbvwLw==');

/*
小电视的像素ByteArray
这里保存ByteArray可以直接用BitmapData.setPixels加载，避免用Loader.load的异步繁琐步骤。
*/
var RAW_bilitv = extract('
tVQ7iFpREHUJ225lGRbrhRRhd+OTIDa2uoKKCPbCFoIobKHyiM//Dz+oqPhDiYI2amdqUWSLNKks
7axTBBacnbnwHupm/RBzYODduXPPnZk358pkp+OD2Wx+9Pl8sjPhR7Vazfd6vWNiH+fzeW88Hr+3
b+33+3+Q7+LIuy9LpVI6kUhArVb7tsN71W63IZVKXUcikX0cT5PJ5L7VanHZbJYLBAJ3TqdT63a7
fwuC8Iy+20ajcZvJZGa4/u5yub5gDIut1+sc3kH2cTabiXxQLpehWCxCLBYDPAf5fF6yQqEAeJby
gmg0CpibZKFQCJLJJPA8LzSbTYmP6vtH8NgniQ/rYE6TybTXrFYrWCwWwHlhRj6VSsX4crmcxBcM
BhkfxZ8KrVbL+LBPEh/1QcxPhMPhALlcvnU2Ho+DQqHY8imVyoN8arV6b070307hI3S7Xenbbre/
y30sH/WdUKlUWI+WyyUYjUZYLBZH89lstq1Yg8EAOp2OfaP+/9oHjUbzhg/
nne3p9fqDM7NrHMe9
mRea8XPOM+kN12wOsfZ1Op3e0tyu0f3hcHhNmiN9ot74Db19nU6nHOq0gj1ar1Yr6tWNqPcd+4z+
X16vl3J68Xg8n7BOf6fTedh4D0Q8DAaDn/hWXA+Hw33vkR/3AeOE0Wgk+894BQ==');

/*
子弹的像素
*/
var RAW_bullet = extract('Y2BgYPj/H4IZ4GwwgItD2EDcgKQGygYA');

/*
为了给玩家和反向工程的玩家增加一点乐趣，把保存等级的一个数组序列化成ByteArray在这里。
*/
var Array_achievements = extract('
Lc9BLwNBFAfwVOpRsSJWJOvAQSQuvTg7O/sQPoTjtkzaXavKRrVa0tIqUYtaNVnUl5k3M/0W5m0k
c5jfm5n3f5PLZ3LTmewUWJLfmUXIgoVvFd08JgDYqvIo33v4GZNnwZYtT/tFGZ6Q58DG11NkHnbT
83mwBb9Cv4NndfICWCqI8blKWARHjxg+FHR4rYInKi2BpQ9/pBcSls0Y7RKyD8KKSfJd2XrBiJFX
zc1CIJKEsAaW4CFGI8KGGbjbR14mbJkeFw3Bvwj5NNAEoN/Ubtpm21xmRzpOM3bAUcmt9ob0p/45
lXZhXQ0GgrsTtyjb3/+v9sCR5bqsXeJ9TQ3HVNqHGdW7od0BbFLKb0lHYx11BPcnjeof');

/*
把$.createComment包装了一下，用起来写代码少一点。
各个属性如果没有特别说明请查看Adobe文档关于TextField。
*/
function createText(text, config) {
    var self = fixz($.createComment(text, {
        y: config.y || 0,//这个跟if (config.y) y = config.y; else y = 0;是一样的
        fontsize: config.fontsize || 14,
        lifeTime: 0,
        parent: config.parent
    }));
    self.visible = false;
    self.autoSize = config.align || 'center';//居中排版
    self.width = config.parent.width;//parent是一个CommentCanvas，它的width必须fillRect之后才不为0。

    /* 希望用户能通过选定并复制粘贴游戏成绩。但是默认的选定背景颜色是黑色，看不出来选定了哪个，以下代码把选定背景颜色改成白色。 */
    self.textColor = 0xff0000;
    var cm = create('flash.filters.ColorMatrixFilter');
    cm.matrix = [0, -1, 0, 0, 255,
                 0, -1, 0, 0, 255,
                 0, -1, 0, 0, 255,
                 0, 0, 0, 1, 0];
    self.filters = [cm];
    self.selectable = true;
    self.mouseEnabled = true;

    if (config.bold !== true) {
        var tf = self.defaultTextFormat;
        tf.bold = false;
        self.defaultTextFormat = tf;
        self.setTextFormat(tf);
    }
    return self;
}

function setFontSize(t, size) {
    var tf = t.defaultTextFormat;
    tf.size = size;
    t.defaultTextFormat = tf;
    t.setTextFormat(tf);
}

function fillRect(g, x, y, width, height, color) {
    g.graphics.beginFill(color);
    g.graphics.drawRect(x, y, width, height);
    g.graphics.endFill();
}

/*
学习以前高级弹幕时发现采用面向对象的编码方式比较科学，个人感觉。
    function createXXX(y) {
        var self = {};
        self.x = y;
        return self;
    }
    var instance = createXXX(1);
大概这样一个结构。
*/
function createGame() {
    var width = 320;//游戏窗口长宽是原版尺寸，如果太大就缺乏难度和趣味了
    var height = 240;
    var self = {
        canvas: fixz($.createCanvas({
            x: Math.round((Player.width - width) / 2),//如果不舍入，可能出现坐标不是整数而边缘模糊的情况（原则上是这样，不过我没有实际测试过到底是不是这回事）
            y: Math.round((Player.height - height) / 2),
            lifeTime: 0
        })),
        playerWidth: Player.width,
        playerHeight: Player.height
    };

    self.border = fixz($.createShape({x: -1, y:-1, lifeTime: 0, parent: self.canvas}));//需要一个白边，长宽都比canvas大2，这样边框宽度就是1
    fillRect(self.border, 0, 0, width + 2, height + 2, 0xffffff);
    self.background = fixz($.createShape({lifeTime: 0, parent: self.canvas}));//黑底背景盖在白底上，就有一个白边
    fillRect(self.background, 0, 0, width, height, 0);
    self.achievements = Array_achievements.readObject();//这里把等级数组完全提取出来
    self.titleText = createText('特训', {y: 40, fontsize: 96, bold: true, parent: self.canvas});
    self.subtitleText = createText('', {y: 40 + 96 + 20, fontsize: 14, parent: self.canvas});
    self.topText = createText('根据你的训练表现，兹授予你', {align: 'left', parent: self.canvas});
    self.achievementText = createText('', {bold: true, parent: self.canvas});
    self.bottomText = createText('职称，望再接再厉。Esc或Q返回开始。', {y: height - 20, align: 'right', parent: self.canvas});

    /* 这四个属性初始化都要等到从异步加载SWF字节码中提取几个函数才能完成 */
    self.keyState = null;//从前面的字节码中加载的ScriptKeyboardState
    self.textureAircraft = null;//这三个都是BitmapData
    self.textureBullet = null;
    self.entityLayer = null;

    /* AABB：轴向包围盒 也就是俗称的“判定点” 是碰撞检测的一种数据结构 */
    self.aircraftAABB = create('flash.geom.Rectangle');
    self.aircraftAABB.width = 14;
    self.aircraftAABB.height = 8;
    self.aircraftAABBOffset = $.createPoint(3, 7);//AABB相对于材质左上角的位置坐标点
    self.bulletAABBOffset = $.createPoint(2, 2);

    /* 游戏开始时和用户按Esc或Q键时调用此方法，重置游戏状态
       游戏有几个状态
        loading - 初始画面“特训……”
        playing - 游戏进行
        over - 用户触发子弹碰撞，游戏结束，显示成绩
        end - 以对话的方式显示用户成绩对应的等级，增加趣味，并给用户听完BGM的机会
     */
    self.reset = function() {
        self.gameState = 'loading';
        self.bullets = [];//子弹是个数组
        self.survivedFrames = 0;
        self.finishedBullets = 0;
        self.aircraftAABB.x = width / 2;
        self.aircraftAABB.y = height / 2;
        self.subtitleText.text = '控制: W A S D\n 开始: Space \n 更新: 支持网页全屏模式Q键返回\n 计算帧率信息';
        self.startTime = 0;
        takeFocus();
    };
    self.reset();

    self.mainLoop = function() {
        /*
        不知道怎地丢了一截代码，下面是回忆的内容。所有弹幕包括高级弹幕都是$.root的自节点。这里检查游戏canvas是否在顶部。因为普通弹幕会遮挡游戏界面，用户抱怨较大。
        不过这个方法也不是完美，会出现有弹幕遮挡一下游戏界面然后晃一下到底下的不自然表现。我暂时没想到更好的方案。
        var selfIndex = $.root.getChildIndex(self.canvas);
        if (selfIndex != $.root.numChildren - 1)
            $.root.swapChildrenAt(selfIndex, $.root.numChildren - 1);
        */
        /* 有用户提出网页全屏模式下无法玩，这里在播放器尺寸变化的时候，把游戏canvas窗口随时置中。
           也许更好的方式是在webFullscreen事件的时候修改一次canvas的位置，但是我一时间没找到往哪里addEventListener。 */
        if (self.playerWidth != Player.width || self.playerHeight != Player.height) {
            self.canvas.x = Math.round((Player.width - width) / 2),
            self.canvas.y = Math.round((Player.height - height) / 2),
            self.playerWidth = Player.width;
            self.playerHeight = Player.height;
        }
        /* 在重新开始播放或者什么情况下（记不清了）$.root的所有子节点的visible都会被赋值为false，然后所有都不见了。所以需要不断设成true。 */
        self.background.visible = true;
        self.canvas.visible = true;
        /* 以下是游戏状态转移。在显示用户等级的界面按Q键返回。这个方法不太好，因为如果用户按Q时间太短可能就没捕捉到这个状态，最理想是用Player.keyTrigger，不过API里面不提供Q键，所以没办法。 */
        if (self.gameState == 'end' && self.keyState.isDown(Keyboard.Q)) {
            self.reset();
            Player.seek(0);
            Player.pause();
            return;
        }
        /* 在开始界面按空格继续。实际上这里空格是播放器本身的暂停/继续功能，这里只通过利用Player.state来了解播放的状况，不用对按键状态的特殊处理。 */
        if (Player.state == 'playing' && self.gameState == 'loading') {
            self.gameState = 'playing';
            self.startTime = getTimer();
        }
        /* 在成绩界面按空格继续。同上。 */
        if (Player.state == 'playing' && self.gameState == 'over') {
            self.gameState = 'end';
            self.entityLayer.fillRect(self.entityLayer.rect, 0);//把背景清空
            self.achievements.some(function(a) {//根据存活时间找到对应等级
                self.achievementText.text = a[1];
                return self.survivedFrames / 60 <= a[0];
            });
            setFontSize(self.achievementText, 280 / self.achievementText.text.length);//设置等级字体大小，不然会撑出界面
            self.achievementText.y = Math.round((height - self.achievementText.height) / 2);//垂直居中。Adobe好像没提供垂直居中的接口，要手动。
        }
        self.titleText.visible = self.gameState == 'loading';
        self.subtitleText.visible = self.gameState == 'loading' || self.gameState == 'over';
        self.topText.visible = self.gameState == 'end';
        self.achievementText.visible = self.gameState == 'end';
        self.bottomText.visible = self.gameState == 'end';
        if (Player.state != 'playing' || self.gameState != 'playing') return;

        var elapsed = (getTimer() - self.startTime) / 1000;//Flash虚拟机时间，用来控制游戏难度和计算游戏帧率
        self.survivedFrames++;
        self.entityLayer.lock();//参见BitmapData文档，目的是优化性能

        /* 这里用BitmapData是因为绘图很快。也许我生成用createComment生成几百个子弹也行，不过性能实在没把握。BitmapData是非常快的。 */
        self.entityLayer.fillRect(self.entityLayer.rect, 0);

        /* Point这个对象操作也很快，适合大量用 */
        var speed = 1 + elapsed / 120;//因为不能允许用户无限的玩下去（Night of Knights只有三分钟多一点），设成游戏速度随时间增加，所以我觉得120秒真是不可能完成的任务了。另外一点这个3分钟的视频只有一个关键帧，所以用户是无法seek的。
        var me = self.aircraftAABB;
        var dx = 0;
        var dy = 0;
        if (self.keyState.isDown(Keyboard.W)) dy -= speed;
        if (self.keyState.isDown(Keyboard.S)) dy += speed;
        if (self.keyState.isDown(Keyboard.A)) dx -= speed;
        if (self.keyState.isDown(Keyboard.D)) dx += speed;
        me.offset(dx, dy);
        /* 以下检查飞机不能飞出去了 */
        if (me.left < 0) me.offset(-me.left, 0);
        if (me.right > width) me.offset(width - me.right, 0);
        if (me.top < 0) me.offset(0, -me.top);
        if (me.bottom > height) me.offset(0, height - me.bottom);
        self.entityLayer.copyPixels(self.textureAircraft, self.textureAircraft.rect, me.topLeft.subtract(self.aircraftAABBOffset), null, null, true);//把飞机的材质贴到背景上

        /* 补充飞出去的子弹。子弹数随时间增加。 */
        while (self.bullets.length < 40 + elapsed) {
            var pos;
            //从画面外一圈随机一点出发
            if (Math.random() > 0.5) {
                pos = $.createPoint(Utils.rand(-20, 20), Utils.rand(-20, height + 20));
                if (pos.x > 0) pos.x += width;
            } else {
                pos = $.createPoint(Utils.rand(-20, width + 20), Utils.rand(-20, 20));
                if (pos.y > 0) pos.y += height;
            }
            
            var target = $.createPoint(Utils.rand(me.x - 50, me.x + 50), Utils.rand(me.y - 50, me.y + 50));//自机狙…… 瞄准自机周围50像素范围内随机一点
            var vel = target.subtract(pos);
            vel.normalize(speed);//跟自机同速，这样避弹有一定难度
            self.bullets.push({
                pos: pos,
                vel: vel,
                life: 0
            });
        }

        self.finishedBullets += self.bullets.length;//结束成绩的“避弹”就是这个变量，表示飞出画面的子弹数
        self.bullets = self.bullets.filter(function(bullet) {//查看Array的filter方法
            bullet.pos.offset(bullet.vel.x, bullet.vel.y);
            bullet.life++;
            if (me.containsPoint(bullet.pos)) {//碰撞检测，自机的判定是一个AABB，子弹就是一个点，containsPoint是Rectangle的一个方法。很简陋，基本管用。
                self.gameState = 'over';
                var playerTime = Player.time;
                var time = ((self.survivedFrames / 6) ^ 0) * 100 + (Player.time ^ 0) % 100;//这里小数点最后两位采用的播放器时间，我想看看有多少用户是在成绩界面复制了屏幕上的文本，有没有用户伪造成绩。
                var timestr = ((time / 1000) ^ 0) + '.' + ((time % 1000) ^ 0);//因为浮点误差有些用户出现1.0000000003这种情况，这里保险一点的做法，不太正确，不过暂时没时间去尝试正确做法。
                self.subtitleText.text = '避弹: ' + self.finishedBullets + '\n 存活: ' + timestr + '\n 帧率: ' + ((self.survivedFrames / elapsed) ^ 0) + '\n 按Space继续';
                //我知道会有用户会不断暂停或者烧CPU降低帧率来延长存活时间，这里存活时间只跟游戏帧数有关，跟播放器时间没有主要关系。
                //当然，这都是正常的用户心理，这里只是提供一个严格的参照依据，而不是阻止用户去那么做，也阻止不了。
                Player.pause();
            }
            self.entityLayer.copyPixels(self.textureBullet, self.textureBullet.rect, bullet.pos.subtract(self.bulletAABBOffset), null, null, true);//把子弹的材质贴到背景上
            return bullet.life < 100 || self.entityLayer.rect.containsPoint(bullet.pos);//如果子弹已经进入过画面，而且现在在画面外面，就要把这个子弹删掉。
        });
        self.finishedBullets -= self.bullets.length;

        self.entityLayer.unlock();
    };

    self.go = function() {
        Player.keyTrigger(function(keyCode) {//游戏状态转移。在显示用户等级的界面按Esc键返回。在网页全屏和全屏模式Esc是返回不全屏模式，所以这里有个跟播放器已有键盘映射冲突，特别加上Q键避免冲突。
            if (keyCode == Keyboard.ESCAPE && self.gameState == 'end') {
                self.reset();
                Player.seek(0);
                Player.pause();
            }
        }, 2147483647);//2147483647毫秒应该足够长了
        //以下加载SWF字节码，查看Loader的Adobe文档
        var loader = create('flash.display.Loader');
        loader.contentLoaderInfo.addEventListener('complete', function(e) {
            var ScriptKeyboardState = e.target.applicationDomain.getDefinition('ScriptKeyboardState');
            var setStageFramerate = e.target.applicationDomain.getDefinition('setStageFramerate');
            var createBitmapData = e.target.applicationDomain.getDefinition('createBitmapData');
            self.keyState = ScriptKeyboardState.getInstance($.root);
            setStageFramerate($.root, 60);
            var loadBitmapData = function(width, height, data) {//创建一个BitmapData，并用一个ByteArray设置像素内容
                var bmd = createBitmapData(width, height);
                data.position = 0;
                bmd.setPixels(bmd.rect, data);
                return bmd;
            };
            var createBitmap = function(bitmapData) {//用一个BitmapData创建一个Bitmap
                var bmp = create('flash.display.Bitmap');
                bmp.bitmapData = bitmapData;
                return bmp;
            };

            self.textureBullet = loadBitmapData(4, 4, RAW_bullet);
            self.textureAircraft = loadBitmapData(20, 20, RAW_bilitv);
            self.entityLayer = createBitmapData(width, height, true, 0);
            self.canvas.addChild(createBitmap(self.entityLayer));
            self.canvas.addEventListener('enterFrame', self.mainLoop);//enterFrame事件是mainLoop的正确进入方法
        });
        loader.loadBytes(SWF_library);//因为这个加载的异步方式实在是很烦，所以BitmapData的加载本来也可以这样做，现在就改成同步的加载方式。
    };
    return self;
}

if ($G._get('gameInstance') === undefined) {//单例模式，避免重复初始化游戏。我觉得更好的做法是createGame提供一个destructor，不过暂时还比较懒。
    Player.seek(0);
    Player.pause();
    var game = createGame();
    $G._set('gameInstance', game);
    game.go();
}
/*
​