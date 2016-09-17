//
//类似库的东西
//无成公子，2012年12月
//所有时间输入都是秒，度数都是弧度，duration最小为EPSILON
//
//
//其它函数
//
//var create = $.root.loaderInfo.content.create;
//ScriptManager.clearTimer();
load("libBitmap",function(){});
function setSchedule(schedule){
	function scheduleFunction(){
		if(schedule == null || schedule.length == 0){
			return;
		}
		if(Player.time > schedule[0][0]){
			var s = schedule.shift();
			if(Player.time - 500 < s[0]){
				(s[1])();
			}
		}
	}
	$.root.addEventListener('enterFrame',scheduleFunction);
}
$G._set('setSchedule',setSchedule);
function extract(data){
    // var b64dec = create('mx.utils.Base64Decoder');
    // b64dec.decode(data);
    // var bytes = b64dec.toByteArray();
    // bytes.inflate();
    // return bytes;
    return null;
}
$G._set('extract',extract);
//
//数学函数
//
var PI = 3.1415926;
$G._set('PI',PI);
var EPSILON = 0.01;
$G._set('EPSILON',EPSILON);
//用于1以下的正负对称随机数
function getRand(range){
	var temp = Utils.rand(-100,100);
	return temp / 100 * range;
}
$G._set('getRand',getRand);
function getColor(R,G,B){
	return R*65536 + G*256 + B;
}
$G._set('getColor',getColor);
//艳丽的颜色
function getRandColor(){
	var u = 100;
	var d = 156;
	var type = Utils.rand(0,6);
	switch(type){
		case 0:return getColor(Utils.rand(d,256),Utils.rand(0,u),Utils.rand(0,u));
		case 1:return getColor(Utils.rand(0,u),Utils.rand(d,256),Utils.rand(0,u));
		case 2:return getColor(Utils.rand(0,u),Utils.rand(0,u),Utils.rand(d,256));
		case 3:return getColor(Utils.rand(d,256),Utils.rand(d,256),Utils.rand(0,u));
		case 4:return getColor(Utils.rand(d,256),Utils.rand(0,u),Utils.rand(d,256));
		default:return getColor(Utils.rand(0,u),Utils.rand(d,256),Utils.rand(d,256));
	}
}
$G._set('getRandColor',getRandColor);

//
//比例函数
//
var WBYH = 848 / 480;
$G._set('WBYH',WBYH);
function getX(ix){
	var pw = Player.width;
	var ph = Player.height;
	var pWH = pw / ph;
	if(pWH > WBYH){
		var rw = ph * WBYH;
		var x = ix * rw + (pw - rw) / 2;
		return Math.round(x);
	}
	else{
		var x = ix * pw;
		return Math.round(x);
	}
}
$G._set('getX',getX);
function getY(iy){
	var pw = Player.width;
	var ph = Player.height;
	var pWH = pw / ph;
	if(pWH < WBYH){
		var rh = pw / WBYH;
		var y = iy * rh + (ph - rh) / 2;
		return Math.round(y);
	}
	else{
		var y = iy * ph;
		return Math.round(y);
	}
}
$G._set('getY',getY);
function getH(iy){
	var pw = Player.width;
	var ph = Player.height;
	var pWH = pw / ph;
	var ret = 0;
	if(pWH < WBYH){
		var rh = pw / WBYH;
		var y = iy * rh;
		ret = Math.round(y);
	}
	else{
		var y = iy * ph;
		ret = Math.round(y);
	}
	//
	// if(ret%2 == 0){
	// 	ret ++;
	// }
	return ret;
}
$G._set('getH',getH);
function getFontWidth(size,str){
	// var c = str.charAt(0);
	// if(c>='a' && c<='z' || c>='A' && c<='Z'){
	// 	return Math.round(size*0.1);
	// }
	return Math.round(size);
}
$G._set('getFontWidth',getFontWidth);
//
//新建函数
//
function newParams(ix,iy,f,l){
	return {lifeTime:l,x:ix,y:iy,fontsize:f};
}
$G._set('newParams',newParams);
function newMotion(f,t,d,l){
	return {fromValue:f,toValue:t,startDelay:d,lifeTime:l};
}
$G._set('newMotion',newMotion);
function newComment(str,ix,iy,f,l,c){
	var p = newParams(ix,iy,f,l);
	p.color = c;
	var co = $.createComment(str,p);
	co.filters = null;
	return co;
}
$G._set('newComment',newComment);
//
//图片函数
//
//读取图片
//[froml,tol]
function loadImage(imgdata,imgstr,width,height,froml,tol,alpha){
	//参数设置
	var LOOPEND = 5;
	var TIMESTEP = 20;
	//主函数
	var bmp = null;
	if($G._get(imgstr) == undefined){
		if(alpha == true){
			bmp = Bitmap.createBitmapData(width,height,true,0);
		}
		else{
			bmp = Bitmap.createBitmapData(width,height,false,0);
		}
		$G._set(imgstr,[width,height,bmp]);
	}
	bmp = ($G._get(imgstr))[2];
	var l = froml;
	var i = 0;
	function load(){
		for(var k=0;k<LOOPEND;k++){
			if(l == tol + 1) break;
			for(var j=0;j<width;j++){
				var c = imgdata[i][j];
				if(alpha == true){
					if(c != -1){
						c += 0xFF000000;
					}
					else{
						c = 0;
					}
				}
				bmp.setPixel32(j,l,c);
			}
			i++;
			l++;
		}
		if(l != tol + 1){
			interval(load,TIMESTEP,1);
		}
	}
	interval(load,TIMESTEP,1);
}
$G._set('loadImage',loadImage);
//显示图片
//cx,cy指图片中间的坐标
function showImage(imgdata,cx,cy,h,duration,motions){
	var scale = h / imgdata[1];
	var newh = h;
	var neww = newh * imgdata[0] / imgdata[1];
	var thisx = cx - neww / 2;
	var thisy = cy - newh / 2;
	//var ca = $.createCanvas({x:thisx,y:thisy,lifeTime:duration,motion:motions});
	//ca.scaleX = scale;
	//ca.scaleY = scale;
	// var loader = create('flash.display.Loader');
	// loader.contentLoaderInfo.addEventListener('complete', function(e) {
	//     var bmp = e.target.content;
	//     ca.addChild(bmp);
	// });
	// loader.loadBytes(imgdata[2]);
	var canvas = Bitmap.createBitmap({bitmapData:imgdata[2],lifeTime:duration,motion:motions});
	canvas.x = thisx;
	canvas.y = thisy;
	canvas.scaleX = canvas.scaleY = scale;
	return canvas;
}
$G._set('showImage',showImage);
//
//字符函数
//
//字符飞入
//[simuhide,TIMEOVERLAP,DISOVERLAP,DIRECTION]
function stringIn(str,ix,iy,color,filter,fontsize,duration1,duration2,controls){
	//参数设置

	//主函数
	var fontwidth = getFontWidth(fontsize,str);
	var thisx = ix;
	var thisy = iy;
	var xstep = fontwidth * controls[2] * Math.cos(controls[3]);
	var ystep = fontwidth * controls[2] * Math.sin(controls[3]);
	var thisd = 0;
	var timestep = duration1 / str.length;
	var acttime = timestep * (1 + controls[1]);
	var i = 0;
	for(;i<str.length;i++){
		var motions = {};
		motions.x = newMotion(thisx - xstep,thisx,thisd * 1000,acttime);
		motions.y = newMotion(thisy - ystep,thisy,thisd * 1000,acttime);
		motions.alpha = newMotion(0,1,thisd * 1000,acttime);
		var params = newParams(thisx,iy,fontsize,duration2);
		if(!controls[0]){
			params.lifeTime = acttime + duration2 + thisd;
		}
		params.motion = motions;
		params.color = color;
		params.alpha = 0;
		var c = $.createComment(str.charAt(i),params);
		c.filters = filter;
		//
		thisx += fontwidth;
		thisd += timestep;
	}
}
$G._set('stringIn',stringIn);
//字符飞出
//[unused,TIMEOVERLAP,DISOVERLAP,DIRECTION]
function stringOut(str,ix,iy,color,filter,fontsize,duration1,duration2,controls){
	//参数设置

	//主函数
	var fontwidth = getFontWidth(fontsize,str);
	var thisx = ix;
	var thisy = iy;
	var xstep = fontwidth * controls[2] * Math.cos(controls[3]);
	var ystep = fontwidth * controls[2] * Math.sin(controls[3]);
	var thisd = duration2;
	var timestep = duration1 / str.length;
	var acttime = timestep * (1 + controls[1]);
	var i = 0;
	for(;i<str.length;i++){
		var motions = {};
		motions.x = newMotion(thisx,thisx + xstep,thisd * 1000,acttime);
		motions.y = newMotion(thisy,thisy + ystep,thisd * 1000,acttime);
		motions.alpha = newMotion(1,0,thisd * 1000,acttime);
		var params = newParams(thisx,iy,fontsize,thisd+acttime);
		params.motion = motions;
		params.color = color;
		var c = $.createComment(str.charAt(i),params);
		c.filters = filter;
		//
		thisx += fontwidth;
		thisd += timestep;
	}
}
$G._set('stringOut',stringOut);
//字符画半圆
//[startangle,endangle],[simuhide,alpha,useStr,flip]
function stringArc(str,cx,cy,r,angle,color,filter,fontsize,duration1,duration2,controls){
	//参数设置

	//主函数
	if(str.length < 2){
		return;
	}
	var loopend = (controls[2] == 0)?str.length:controls[2];
	var anglestep = (angle[1] - angle[0]) / (loopend - 1);
	var timestep = duration1 / loopend;
	var thisd = 0;
	var thisa = angle[0];
	var i = 0;
	for(;i<loopend;i++){
		var motions = {};
		var thisx = cx + r * Math.sin(thisa);
		var thisy = cy - r * Math.cos(thisa);
		var params = newParams(thisx,thisy,fontsize,duration2);
		if(!controls[0]){
			params.lifeTime = duration2 + thisd + timestep;
		}
		motions.alpha = newMotion(0,1,thisd * 1000,timestep);
		if(controls[1] == false){
			motions.alpha.lifeTime = EPSILON;
		}
		else if(controls[1] != true){
			motions.alpha.toValue = controls[1];
		}
		params.alpha = 0;
		params.motion = motions;
		params.color = color;
		var thiss = (controls[2] == 0)?str.charAt(i):str;
		var c = $.createComment(thiss,params);
		c.filters = filter;
		if(controls[3]){
			c.scaleY = -1;
		}
		//
		thisd += timestep;
		thisa += anglestep;
	}
}
$G._set('stringArc',stringArc);
//字符画直线
//[fromx,fromy,direction,step][simuhide,alpha,useStr,hor-center,rotate,flip]
function stringLine(str,ordinate,color,filter,fontsize,duration1,duration2,controls){
	//参数设置

	//主函数
	var FONTWIDTH = getFontWidth(fontsize,str);
	if(controls[3]){//其它也需设置好
		ordinate[0] -= Math.round(str.length * FONTWIDTH / 2);
	}
	var thisx = ordinate[0];
	var thisy = ordinate[1];
	var xstep = ordinate[3] * Math.cos(ordinate[2]);
	var ystep = ordinate[3] * Math.sin(ordinate[2]);
	var thisd = 0;
	var loopend = (controls[2] == 0)?str.length:controls[2];
	var delaystep = duration1 / loopend;
	var i = 0;
	for(;i<loopend;i++){
		var amotion = newMotion(0,1,thisd*1000,delaystep);
		if(controls[1] == false){
			amotion.lifeTime = EPSILON;
		}
		else if(controls[1] != true){
			amotion.toValue = controls[1];
		}
		var cparams = newParams(thisx,thisy,fontsize,duration2);
		cparams.alpha = 0;
		cparams.motion = {alpha:amotion};
		cparams.color = color;
		if(!controls[0]){
			cparams.lifeTime = duration2 + thisd + delaystep;
		}
		var thiss = (controls[2] == 0)?str.charAt(i):str;
		var c = $.createComment(thiss,cparams);
		c.filters = filter;
		if(controls[4]){
			c.rotationZ = ordinate[2] * 180 / PI;
		}
		if(controls[5] == true){
			c.scaleY = -1;
		}
		//更新
		thisx += xstep;
		thisy += ystep;
		thisd += delaystep;
	}
}
$G._set('stringLine',stringLine);
//
//文字效果
//
//数字增加
function addNumber(ix,iy,duration1,duration2,start,end,FONTSIZE,icolor,filter){
	//参数设置
	var TIMEGAP = 0.05;
	//主函数
	var times = 0;
	var totalTimes = Math.ceil(duration1 / TIMEGAP);
	var num = start;
	var numGap = Math.ceil((end - start) / totalTimes);
	function add(){
		times++;
		if(times == totalTimes){
			var c = $.createComment(end,{x:ix,y:iy,fontsize:FONTSIZE,lifeTime:duration2,color:icolor});
			c.filters = filter;
		}
		else{
			var c = $.createComment(num,{x:ix,y:iy,fontsize:FONTSIZE,lifeTime:TIMEGAP,color:icolor});
			c.filters = filter;
			num += numGap;
		}
	}
	interval(add,TIMEGAP * 1000,totalTimes);
}
$G._set('addNumber',addNumber);
//随机飞扬效果（参数太多了。。。）
//[x,y,itox,itoy][direction,length,lifetime,color,fontsize,filter,fontscale,alpha][Di,Len,Delay,Life]
function singleRandFly(character,ordinates,r,duration,amount,flyparams,randparams){
	//参数设置

	//主函数
	var x = ordinates[0];
	var y = ordinates[1];
	var i = 1;
	var stepx = (ordinates[2] - x)/amount;
	var stepy = (ordinates[3] - y)/amount;
	var stept = duration/amount;
	for(;i<=amount;i++){
		var thisx = x + stepx * i + getRand(1) * r;
		var thisy = y + stepy * i + getRand(1) * r;
		var di = getRand(randparams[0]) * PI + flyparams[0];
		var tox = thisx + flyparams[1] * Math.sin(di) * (1 + getRand(randparams[1]));
		var toy = thisy + flyparams[1] * Math.cos(di) * (1 + getRand(randparams[1]));
		var startDelay = (i + getRand(randparams[2])) * stept * 1000;
		var lifeTime = (1 + getRand(randparams[3])) * flyparams[2];
		var params = newParams(thisx,thisy,Math.round(flyparams[4]*(1 - i*flyparams[6])),startDelay / 1000 + lifeTime);
		//params.rotationX = di;
		params.alpha = 0;
		if(flyparams[3] == -1){
			params.color = getRandColor();
		}
		else{
			params.color = flyparams[3];
		}
		//变化部分
		var motion = {};
		var xmotion = newMotion(thisx,tox,startDelay,lifeTime);
		motion.x = xmotion;
		var ymotion = newMotion(thisy,toy,startDelay,lifeTime);
		motion.y = ymotion;
		var toa = flyparams[7];
		if(toa == undefined){
			toa = 1;
		}
		var amotion = newMotion(0,1,startDelay,lifeTime);
		motion.alpha = amotion;
		params.motion = motion;
		var c = $.createComment(character,params);
		c.filters = flyparams[5];
	}
}
$G._set('singleRandFly',singleRandFly);
//绘制图框
function drawFrame(str,cx,cy,img,height,duration1,duration2,simuhide,fontsize,color,filter){
	var width = img[0] * height / img[1];
	var wcount = Math.round(width / fontsize) / 0.7;
	var hcount = Math.round(height / fontsize) / 0.7;
	width /= 2;
	height /= 2;
	var pLU = [cx - width,cy - height];
	var pLD = [cx - width,cy + height];
	var pRU = [cx + width,cy - height];
	var pRD = [cx + width,cy + height];
	var fontBias = fontsize * 0.5;
	var fontStep = fontsize * 0.7;
	stringLine(str,[pLU[0]-fontBias,pLU[1]-fontBias,0,fontStep],color,filter,fontsize,duration1,duration2,[simuhide,true,wcount,false,true]);
	stringLine(str,[pRU[0]+fontBias,pRU[1]-fontBias,PI/2,fontStep],color,filter,fontsize,duration1,duration2,[simuhide,true,hcount,false,true]);
	stringLine(str,[pRD[0]+fontBias,pRD[1]+fontBias,PI,fontStep],color,filter,fontsize,duration1,duration2,[simuhide,true,wcount,false,true]);
	stringLine(str,[pLD[0]-fontBias,pLD[1]+fontBias,-PI/2,fontStep],color,filter,fontsize,duration1,duration2,[simuhide,true,hcount,false,true]);
}
$G._set('drawFrame',drawFrame);
//文字框效果
function dialogBase(cx,cy,duration,width,height,direction,cOut,cIn,str,cStr,fontsize){
	//数据计算
	var sx,sy;
	var tx=[],ty=[];
	var rx,ry;
	var rw = width;
	var rh = height;
	if(direction > 0){
		rx = 0;
		ry = 0;
		sx = cx - rw / 2;
		sy = cy - rh / 2;
		ty[0] = rh;
		ty[1] = ty[0];
		ty[2] = ty[0] + rh;
		if(direction == 1){
			tx[0] = rh / 2;
			tx[1] = rh;
			tx[2] = 0;
		}
		else{
			tx[0] = rw - rh / 2;
			tx[1] = rw - rh;
			tx[2] = rw - 0;
		}
	}
	else{
		ty[0] = rh;
		ty[1] = rh;
		ty[2] = 0;
		rx = 0;
		ry = ty[0];
		sx = cx - rw / 2;
		sy = cy - rh / 2 - ry;
		if(direction == -1){
			tx[0] = rh / 2;
			tx[1] = rh;
			tx[2] = 0;
		}
		else{
			tx[0] = rw - rh / 2;
			tx[1] = rw - rh;
			tx[2] = rw - 0;
		}
	}
	//绘制
	var g = $.createShape({x:sx,y:sy,lifeTime:duration,alpha:0.75});
	g.graphics.beginFill(cOut);
	g.graphics.moveTo(tx[0],ty[0]);
	g.graphics.lineTo(tx[1],ty[1]);
	g.graphics.lineTo(tx[2],ty[2]);
	g.graphics.lineTo(tx[0],ty[0]);
	g.graphics.endFill();

	g.graphics.beginFill(cOut);
	g.graphics.drawRoundRect(rx,ry,rw,rh,rh,rh);
	g.graphics.endFill();

	var change = rh * 0.1;

	if(direction > 0){
		ty[0] -= change * 2;
		ty[1] -= change * 2;
		ty[2] -= change * 2;
	}
	else{
		ty[0] += change * 2;
		ty[1] += change * 2;
		ty[2] += change * 2;
	}
	if(Math.abs(direction) == 1){
		tx[0] += change * 1.5;
		tx[1] += change * 1.0;
		tx[2] += change * 1.5;
	}
	else{
		tx[0] -= change * 1.5;
		tx[1] -= change * 1.0;
		tx[2] -= change * 1.5;
	}

	g.graphics.beginFill(cIn);
	g.graphics.moveTo(tx[0],ty[0]);
	g.graphics.lineTo(tx[1],ty[1]);
	g.graphics.lineTo(tx[2],ty[2]);
	g.graphics.lineTo(tx[0],ty[0]);
	g.graphics.endFill();

	rh -= change * 2;
	rw -= change * 2;
	rx += change;
	ry += change;
	g.graphics.beginFill(cIn);
	g.graphics.drawRoundRect(rx,ry,rw,rh,rh,rh);
	g.graphics.endFill();
	//
	var fontWidth = getFontWidth(fontsize,str);
	var fx = Math.round(sx + rx + rw / 2 - fontWidth * str.length / 2);
	var fy = Math.round(sy + ry + rh / 2 - fontsize / 2);
	newComment(str,fx,fy,fontsize,duration,cStr);
}
$G._set('dialogBase',dialogBase);
//字符闪烁
function stringFlash(str,x,y,duration1,duration2,fontsize,hmid,red){
	var step = fontsize * 0.95;
	var c = str.charAt(0);
	if(c>='a' && c<='z' || c>='A' && c<='Z'){
		step *= 0.5;
	}
	var glow = fontsize * 0.2;
	var sf = $.createGlowFilter(0xFF0000,1,glow,glow,red,1,false,false);
	stringLine(str,[x,y,0,step],0xFFFFFF,[sf],fontsize,duration1,duration2,[false,true,0,hmid,false]);
	var ff = $.createGlowFilter(0xFFFFFF,1,glow,glow,8,1,false,false);
	stringLine(str,[x,y,0,step],0xFFFFFF,[ff],fontsize,duration1,EPSILON,[false,true,0,hmid,false]);
}
$G._set('stringFlash',stringFlash);
//字符刷屏
//[x,y,direction,length][direction,length,amount]
function stringSwarm(str,ordinates,strparams,fontsize,color,filter,duration){
	//
	var DIRAND = 0.5;
	//
	var thisx = ordinates[0];
	var thisy = ordinates[1];
	var tox = ordinates[3] * Math.sin(ordinates[2]);
	var toy = ordinates[3] * Math.cos(ordinates[2]);
	var xstep = strparams[1] * Math.sin(strparams[0]);
	var ystep = strparams[1] * Math.cos(strparams[0]);
	var i = strparams[2];
	for(;i>0;i--){
		var params = newParams(thisx,thisy,fontsize,duration);
		var motions = {};
		var xr = strparams[1] * getRand(DIRAND);
		var yr = strparams[1] * getRand(DIRAND);
		motions.x = newMotion(thisx+xr,thisx+xr+tox,0,duration);
		motions.y = newMotion(thisy+yr,thisy+yr+toy,0,duration);
		params.motion = motions;
		params.color = color;
		var c = $.createComment(str,params);
		c.filters = filter;
		//
		thisx += xstep;
		thisy += ystep;
	}
}
$G._set('stringSwarm',stringSwarm);
//
//图形效果
//
//绘制圆环
//[inr,outr,scale,duration1]
function drawCircle(cx,cy,rparams,color,delay,lifeTime){
	//参数设置
	var STEP = 0.05;
	//主函数
	var params = {x:cx,y:cy,lifeTime:(delay+rparams[3]+lifeTime),alpha:0};
	var amotion = newMotion(0,1,delay*1000,rparams[3]);
	//var smotion = newMotion(1,rparams[2],delay*1000,rparams[3]);
	params.motion = {alpha:amotion};
	var g = $.createShape(params);
	g.graphics.beginFill(color);
	g.graphics.drawCircle(0,0,rparams[1]);
	g.graphics.drawCircle(0,0,rparams[0]);
	g.graphics.endFill();
	//
	var times = Math.round(rparams[3]/STEP);
	var scaleStep = (rparams[2] - 1) / times;
	function circleScale(){
		g.scaleX += scaleStep;
		g.scaleY += scaleStep;
	}
	function scaleInterval(){
		interval(circleScale,STEP*1000,times);
	}
	interval(scaleInterval,delay*1000,1);
}
$G._set('drawCircle',drawCircle);
//绘制圆环列
//[fromx,fromy,tox,toy][inr,outr,scale,duration1,lifeTime][cr,unused,r,d]
function drawCircles(ordinates,amount,rparams,colorf,colort,duration,randparams){
	//参数设置

	//主函数
	var thisx = ordinates[0];
	var thisy = ordinates[1];
	var thisc = colorf;
	var thisd = 0;
	var xstep = (ordinates[2] - ordinates[0]) / amount;
	var ystep = (ordinates[3] - ordinates[1]) / amount;
	var cstep = [(colort[0] - colorf[0]) / amount,(colort[1] - colorf[1]) / amount,(colort[2] - colorf[2]) / amount];
	var dstep = duration / amount;
	var i = 0;
	for(;i<amount;i++){
		var inr = rparams[0] * (1 + getRand(randparams[2]));
		var outr = rparams[1] * (1 + getRand(randparams[2]));
		var duration1 = rparams[3] * (1 + getRand(randparams[3]));
		drawCircle(thisx+getRand(1)*randparams[0],thisy+getRand(1)*randparams[0],[inr,outr,rparams[2],duration1],getColor(thisc[0],thisc[1],thisc[2]),thisd,rparams[4]);
		//
		thisx += xstep;
		thisy += ystep;
		thisc[0] += cstep[0];
		thisc[1] += cstep[1];
		thisc[2] += cstep[2];
		thisd += dstep;
	}
}
$G._set('drawCircles',drawCircles);
//绘制晋级图样
//[ld,lm,m,rm,rd]
function drawUp(cx,cy,alpha,color,duration,w,h,b,parts){
	//
	//
	var h1 = h - 2 * b;
	var w1 = w/2;
	var b1 = b/2;
	var g = $.createShape({x:cx,y:cy,lifeTime:duration});
	g.alpha = alpha;
	if(parts[0]){
		g.graphics.beginFill(color);
		g.graphics.drawRect(-w1,b,b,h1);
		g.graphics.endFill();
	}
	if(parts[4]){
		g.graphics.beginFill(color);
		g.graphics.drawRect(w1-b,b,b,h1);
		g.graphics.endFill();
	}
	if(parts[1]){
		g.graphics.beginFill(color);
		g.graphics.drawRect(-w1,0,w1-b1,b);
		g.graphics.endFill();
	}
	if(parts[3]){
		g.graphics.beginFill(color);
		g.graphics.drawRect(-b1,0,w1+b1,b);
		g.graphics.endFill();
	}
	if(parts[2]){
		g.graphics.beginFill(color);
		g.graphics.drawRect(-b1,-h1,b,h1);
		g.graphics.endFill();
	}
}
$G._set('drawUp',drawUp);
//绘制右侧晋级
function drawRightUp(cx,cy,alpha,color,duration,w,h,b,delay){
	var step = duration / 3;
	var w1 = w/2;
	var h1 = (h - b) / 2;
	interval(function(){drawUp(cx,cy,alpha,color,duration,w,h,b,[false,false,true,true,true]);},delay * 1000,1);return;

	function rd(){
		drawUp(cx,cy,alpha,color,step*3,w,h,b,[false,false,false,false,true]);return;
		var fromx = cx + w1 - b;
		var fromy = cy + h1;
		var useStr = Math.round(h1 / b) + 2;
		stringLine("★",[fromx,fromy,-PI/2,b],0xFFFF00,null,b,step,step * 0.3,[false,true,useStr,false,false]);
	}
	function rm(){
		drawUp(cx,cy,alpha,color,step*2,w,h,b,[false,false,false,true,false]);return;
		var fromx = cx + w1 - b;
		var fromy = cy;
		var useStr = Math.round(w1 / b);
		stringLine("★",[fromx,fromy,PI,b],0xFFFF00,null,b,step,step * 0.3,[false,true,useStr,false,false]);
	}
	function m(){
		drawUp(cx,cy,alpha,color,step,w,h,b,[false,false,true,false,false]);return;
		var fromx = cx - b / 2;
		var fromy = cy;
		var useStr = Math.round(h1 / b) + 3;
		stringLine("★",[fromx,fromy,-PI/2,b],0xFFFF00,null,b,step,step * 0.3,[false,true,useStr,false,false]);
	}
	//rd();rm();m();
	//interval(rd,(delay) * 1000,1);interval(rm,(delay + step) * 1000,1);interval(m,(delay + step * 2) * 1000,1);
}
$G._set('drawRightUp',drawRightUp);

