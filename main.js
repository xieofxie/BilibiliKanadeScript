//效果时间轴
var tx = 0.5,ty = 0.63,th = 0.09;
var hx1 = 0.3,hx2 = 0.7,hy = 0.4,hh = 0.24;
var nx1 = 0.24,nx2 = 0.64,ny = 0.6,nh = 0.07,nb = 0.1,nc = 0xD1D1D1,nf = 0x3A69AC;
var ux = 0.5,uy = 0.13,uw = 0.65,uh = 0.17,ub = 0.03;
var ia1 = {alpha:newMotion(0,1,0,1)};var ia2 = {alpha:newMotion(1,0,1.5*1000,0.5)};
var schedule = [
[1600, function(){
	singleRandFly("♪",[getX(0.6),getY(0.95),getX(0.45),getY(0.2)],getH(0.05),1.5,8,[1.35*PI,getH(0.6),1,-1,getH(0.15),null,0,0.8],[0.01,0.2,0.8,0.2]);
	stringFlash("My Soul,Your Beats!",getX(0.6),getY(0.53),0.7,0.7,getH(0.075),false,1);
}],
[5100, function(){
	singleRandFly("♪",[getX(0),getY(0.6),getX(0.9),getY(0.6)],getH(0.05),1.5,8,[1.05*PI,getH(0.6),1,-1,getH(0.15),null,0,0.8],[0.01,0.2,0.8,0.2]);
	stringFlash("制作：无成公子",getX(0.5),getY(0.73),0.7,0.7,getH(0.075),false,1);
}],
[8100, function(){
	singleRandFly("♪",[getX(0.5),getY(0.9),getX(0.5),getY(0.9)],getH(0.05),1.5,8,[1.00*PI,getH(0.8),0.5,-1,getH(0.2),null,0,0.8],[0.05,0.2,0.8,0.2]);
}],
[10200, function(){
	var i=1;
	for(;i<4;i++){
		var outr = i * getH(0.15);
		var inr = outr * 0.9;
		drawCircle(getX(0.5),getY(0.9),[inr,outr,20,2.6],0xFFFFFF,0,-1.3);
	}
}],
[11000, function(){
	//singleRandFly("♪",[getX(-0.2),getY(0.3),getX(0.9),getY(0.3)],getH(0.1),1.5,6,[0,0,0.2,-1,getH(0.2),null,0],[0,0,0,0]);
	// for(var i=1;i<6;i++){
	// 	var str = "♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪";
	// 	var lsize = getH(0.1 + 0.05*i);
	// 	var d = str.length * lsize;
	// 	var dsize = lsize * 2;
	// 	var amount = Math.round(getY(1) / dsize) + 1;
	// 	stringSwarm(str,[-d,getY(0),PI*0.5,getX(1)+d],[0,dsize,amount],lsize,0xFFFFFF,null,1.5);
	// }
}],
[13000, function(){
	stringFlash("立华奏世萌萌王纪念",getX(tx),getY(ty),0.7,1.8,getH(th),true,2);
}],
[14800, function(){
	stringFlash("立华奏世萌萌王纪念",getX(tx),getY(ty),0.7,1,getH(th),true,2);
}],
[15800, function(){
	stringFlash("立华奏世萌萌王纪念",getX(tx),getY(ty),0.7,0.9,getH(th),true,2);
}],
[16700, function(){
	stringFlash("立华奏世萌萌王纪念",getX(tx),getY(ty),0.7,1.6,getH(th),true,2);
}],
[17000, function(){
	var lyricSize = getH(0.05);
	var filter = $.createGlowFilter(0xFF0000,1,lyricSize*0.2,lyricSize*0.2,1,1,false,false);
	stringLine("歌词翻译取自",[getX(0.5),getY(0.8),0,lyricSize],0xFFFFFF,[filter],lyricSize,0.5,1,[true,true,0,false,false]);
}],
[18000, function(){
	var lyricSize = getH(0.05);
	var filter = $.createGlowFilter(0xFF0000,1,lyricSize*0.2,lyricSize*0.2,1,1,false,false);
	stringLine("真田有希村＠ＳＯＳＧ",[getX(0.5),getY(0.8),0,lyricSize],0xFFFFFF,[filter],lyricSize,1,2,[true,true,0,false,false]);
	stringLine("ＫｏｔｏｍｉＦＣ会长＠ＫＦＣ",[getX(0.5),getY(0.86),0,lyricSize],0xFFFFFF,[filter],lyricSize,1,2,[true,true,0,false,false]);
}],
[18300, function(){
	var fontsize = getH(th);
	var x = getX(tx);
	var y = getY(ty);
	var duration1 = 0.7;
	var duration2 = 2;
	var bias = getH(0.008);
	var filter = $.createGlowFilter(0x000000,1,fontsize*0.2,fontsize*0.2,2,1,false,false);
	stringLine("立华奏世萌萌王纪念",[x+bias,y+bias,0,fontsize * 0.95],0x000000,[filter],fontsize,duration1,duration2,[false,true,0,true,false]);
	stringFlash("立华奏世萌萌王纪念",x,y,duration1,duration2,fontsize,true,2);
}],
[21500, function(){//2.5
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0xCB8884,1,lyricSize*0.4,lyricSize*0.4,5,1,false,false);
	stringIn("睁开眼睛",getX(0.1),getY(0.2),0xEBE6E2,[filter],lyricSize,1.5,2.8,[true,1,2,0]);
}],
[22000, function(){
	stringFlash("团长亲临现场",getX(0.6),getY(0.65),0.5,0.5,getH(0.075),false,1);
}],
[24300, function(){//3.3
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0xCB8884,1,lyricSize*0.4,lyricSize*0.4,5,1,false,false);
	stringIn("又是一个慵懒的早晨",getX(0.1),getY(0.35),0xEBE6E2,[filter],lyricSize,2.0,3.0,[true,1,2,0]);
}],
[25200, function(){
	dialogBase(getX(0.2),getY(0.85),2.75,getH(0.67),getH(0.2),-2,0xEBA8A4,0xEBE6E2,"有理，你怎么看？",0x747072,getH(0.065));
	dialogBase(getX(0.8),getY(0.1),2.75,getH(0.67),getH(0.2),1,0xEBA8A4,0xEBE6E2,"我在校长室看！",0x747072,getH(0.065));
}],
[27900, function(){
	stringFlash("团员密切关注",getX(0.2),getY(0.55),0.5,0.7,getH(0.075),false,1);
}],
[28000, function(){//6
	var lyricSize = getH(0.07);
	var filter = $.createGlowFilter(0x7993B2,1,lyricSize*0.4,lyricSize*0.4,5,1,false,false);
	stringArc("拉起领结 收紧衣襟",getX(0.4),getY(0.5),getH(0.3),[-PI*0.25,PI*0.95],0xFDFAFA,[filter],lyricSize,5.5,0.5,[false,true,0,false]);
	stringArc("拉起领结 收紧衣襟",getX(0.4),getY(0.67),getH(0.3),[-PI*0.25,PI*0.95],0xFDFAFA,[filter],lyricSize,5.5,0.5,[false,0.5,0,true]);
}],
[31800, function(){
	dialogBase(getX(0.25),getY(0.85),2.35,getH(0.4),getH(0.2),-1,0xB9D3F2,0xFDFAFA,"真是肤浅。",0x757979,getH(0.065));
	dialogBase(getX(0.8),getY(0.1),2.35,getH(0.67),getH(0.2),1,0xB9D3F2,0xFDFAFA,"其实我是脱下衣服显萌的人。  ",0x757979,getH(0.04));
}],
[34800, function(){//6.5
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0x75D06E,1,lyricSize*0.4,lyricSize*0.4,5,1,false,false);
	//stringOut("　♪♪♪♪　　♪♪♪♪♪♪♪",getX(0.1),getY(0.35),0xFBFDFE,[filter],lyricSize,6,EPSILON,[true,2,5,PI/2]);
	stringIn("　走进教室　　在穿过门的瞬间",getX(0.1),getY(0.35),0xFBFDFE,[filter],lyricSize,EPSILON,6,[true,0,0,0]);
	stringIn("　走进教室　　在穿过门的瞬间",getX(0.1),getY(0.35),0xFBFDFE,[filter],lyricSize,5.5,EPSILON,[false,1,2,PI*0.5]);
}],
[34900, function(){
	stringFlash("大家兴高采烈",getX(0.65),getY(0.55),0.5,0.7,getH(0.075),false,1);
}],
[35470, function(){
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0x75D06E,1,lyricSize*0.4,lyricSize*0.4,5,1,false,false);
	stringLine("　走进教室　　在穿过门的瞬间",[getX(0.1),getY(0.35)+2.5*lyricSize,0,lyricSize],0xFBFDFE,[filter],lyricSize,5.4,5.4+EPSILON,[true,0.5,0,false,false,true]);
}],
[38400, function(){
	dialogBase(getX(0.42),getY(0.85),2.65,getH(0.9),getH(0.15),-1,0x95F08E,0xFBFDFE,"Ｋａｎａｄｅ　Ｍｏｅ！ ",0x818482,getH(0.065));
	dialogBase(getX(0.58),getY(0.65),2.65,getH(0.7),getH(0.15),-2,0x95F08E,0xFBFDFE,"　没有特长怎么不是三无的一种呢？　　",0x818482,getH(0.04));
}],
[41000, function(){//6
	var lyricSize = getH(0.06);
	var y = getY(0.4);
	var x = getX(0.15);
	var filter = $.createGlowFilter(0x7B7B50,1,lyricSize*0.4,lyricSize*0.4,2,1,false,false);
	stringIn("这不变的日子里 有风吹过",x,y,0xFBFEFB,[filter],lyricSize,5.0,1.0,[false,1,2,-PI/2]);
	//
	var l = lyricSize * 12;
	var fl = getH(0.14);
	singleRandFly("♪",[x-lyricSize*0.5,y+fl,x+l,y],lyricSize*0.5,5,20,[0,fl*0.4,1,0xFBFEFB,lyricSize*0.8,[filter],0,0.5],[0,0.2,0.1,0.1]);
}],
[41300, function(){
	stringFlash("乐队热烈庆祝",getX(0.65),getY(0.4),0.5,0.7,getH(0.075),false,1);
}],
[44800, function(){
	dialogBase(getX(0.47),getY(0.88),2.65,getH(0.9),getH(0.15),-1,0xF7F7A1,0xFBFEFB,"小奏也努力了呢。",0x95928E,getH(0.065));
	dialogBase(getX(0.78),getY(0.74),2.65,getH(0.7),getH(0.15),-1,0xF7F7A1,0xFBFEFB,"　礼炮班和麻婆豆腐班准备完毕。　　",0x95928E,getH(0.04));
}],
[47600, function(){//6.5
	var lyricSize = getH(0.05);
	var lx = getX(0.1);
	var ly = getY(0.1);
	var filter = $.createGlowFilter(0xD382A9,1,lyricSize*0.2,lyricSize*0.2,3,1,false,false);
	// stringLine("些许自信 飞入胸中",[getX(0.1),getY(0.1),PI*0.35,lyricSize*1.2],0xFFFFFF,[filter],lyricSize,6.0,6.5,[true,true,0,false,false]);
	// stringLine("些许自信 飞入胸中",[getX(0.13),getY(0.1),PI*0.35,lyricSize*1.2],0xFFFFFF,[filter],lyricSize,6.0,6.5,[true,0.4,0,false,false]);
	// stringLine("些许自信 飞入胸中",[getX(0.16),getY(0.1),PI*0.35,lyricSize*1.2],0xFFFFFF,[filter],lyricSize,6.0,6.5,[true,0.2,0,false,false]);
	var scale = 2.4;var bias = lyricSize * (scale - 1) * 0.5;
	stringLine("些许自信 飞入胸中",[lx-bias,ly-bias,0,lyricSize],0xFBFDFE,[filter],lyricSize*scale,6,EPSILON,[false,0.3,0,false,false]);
	var scale = 1.8;var bias = lyricSize * (scale - 1) * 0.5;
	stringLine("些许自信 飞入胸中",[lx-bias,ly-bias,0,lyricSize],0xFBFDFE,[filter],lyricSize*scale,6,EPSILON,[false,0.5,0,false,false]);
	stringIn("些许自信 飞入胸中",lx,ly,0xFBFDFE,[filter],lyricSize,EPSILON,6,[true,0,0,0]);
	//stringOut("些许自信 飞入胸中",lx,ly,0xFBFDFE,[filter],lyricSize,6,EPSILON,[true,2,5,-PI*0.25]);
}],
[50500, function(){
	singleRandFly("♪",[getX(0.2),getY(0.6),getX(0.75),getY(0.6)],getH(0.01),1.5,20,[-PI*0.65,getH(0.5),0.5,0xFFFFFF,getH(0.1),null,0],[0.1,0.2,0.1,0.1]);
}],
[54000, function(){
	stringIn("Rewards Of",getX(0.07),getY(0.8),0x93C0CD,null,getH(0.065),0.5,0.7,[true,3,0.5,0]);
	stringIn("Tachibana Kanade",getX(0.45),getY(0.8),0x93C0CD,null,getH(0.065),0.5,0.7,[true,3,0.5,0]);
}],
[54500, function(){//4
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0x777777,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	stringIn("仿佛能够听见",getX(0.36),getY(0.8),0xFFFFFF,[filter],lyricSize,2,3.5,[true,2,10,PI*0.1]);
}],
[55000, function(){
	var cax = getX(0.6);
	var cay = getY(0.45);
	var cah = getH(0.4);
	var ca = showImage($G._get('TOPAZ'),cax,cay,cah,3,ia1);

	var strSize = getH(0.065);
	var f = $.createGlowFilter(0xEAD118,1,strSize*0.5,strSize*0.5,1,1,false,false);
	stringIn("２０１１年",getX(0.15),getY(0.3),0xD52F15,[f],strSize,1.5,3,[true,3,0.5,0]);
	stringIn("黄玉 项链",getX(0.15),getY(0.5),0xD52F15,[f],strSize,1.5,3,[true,3,0.5,0]);
}],
[57000, function(){
	var ordinates = [getX(0.1),getY(0.5),getX(1),getY(0.5)];
	var rparams = [getH(0.2),getH(0.24),3,2,-1];
	var randparams = [getH(0.1),0,0.1,0.2];
	drawCircles(ordinates,5,rparams,[255,255,0],[255,0,0],1,randparams);
}],
[58000, function(){//6
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0x777777,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	stringOut("仿佛能够感知",getX(0.36),getY(0.8),0xFFFFFF,[filter],lyricSize,5,1,[true,2,10,-PI*0.1]);
}],
[58000, function(){
	var cax = getX(0.5);
	var cay = getY(0.5);
	var cah = getH(0.4);
	var ca = showImage($G._get('SEMIFINAL'),cax,cay,cah,3,ia1);

	stringArc("同年半决赛负于夏娜，获得第三名",cax,cay,cah*1.15,[-PI*0.3,PI*0.3],0xFF7777,null,getH(0.06),1,2,[false,true,0,false]);
	stringArc("同年半决赛负于夏娜，获得第三名",cax,cay,cah*1,[-PI*0.3,PI*0.3],0xFF7777,null,getH(0.06),1,2,[false,0.5,0,false]);
	stringArc("同年半决赛负于夏娜，获得第三名",cax,cay,cah*0.85,[-PI*0.3,PI*0.3],0xFF7777,null,getH(0.06),1,2,[false,0.2,0,false]);
}],
[60000, function(){
	var ordinates = [getX(0.1),getY(0.5),getX(1),getY(0.5)];
	var rparams = [getH(0.2),getH(0.24),3,2,-1];
	var randparams = [getH(0.1),0,0.1,0.2];
	drawCircles(ordinates,5,rparams,[255,0,0],[0,0,255],1,randparams);
}],
[61000, function(){
	var cax = getX(0.3);
	var cay = getY(0.45);
	var cah = getH(0.4);
	var ca = showImage($G._get('AQUAMARINE'),cax,cay,cah,3,ia1);

	var strSize = getH(0.065);
	var f = $.createGlowFilter(0x0000FF,1,strSize*0.5,strSize*0.5,1,1,false,false);
	stringIn("２０１２年",getX(0.6),getY(0.3),0x1111FF,[f],strSize,1.5,3,[true,3,0.5,0]);
	stringIn("海蓝宝石项链",getX(0.6),getY(0.5),0x1111FF,[f],strSize,1.5,3,[true,3,0.5,0]);
}],
[63900, function(){//4
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0x0000FF,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	stringIn("胸口激昂　　　　　　　　　　　　无可遏抑",getX(0.15),getY(0.5),0xAAAAFF,[filter],lyricSize,3,3.8,[true,2,6,PI*0.5]);
}],
[64000, function(){
	var cax = getX(0.5);
	var cay = getY(0.55);
	var cah = getH(0.4);
	var ca = showImage($G._get('SAPPHIRE'),cax,cay,cah,3.9,ia1);

	var strSize = getH(0.06);
	var f = $.createGlowFilter(0x0000FF,1,strSize*0.5,strSize*0.5,1,1,false,false);
	var x = getX(0.5) - 4.5 * strSize;
	stringLine("同年获得蓝宝石头饰",[x,getY(0.2),0,strSize],0xAAAAFF,[f],strSize,2,3.5,[true,true,0,false,false]);
	stringOut("同年获得蓝宝石头饰",x,getY(0.2),0xAAAAFF,[f],strSize,2,1,[true,2,10,PI*0.5]);
}],
[67900, function(){
	stringFlash("决赛夺冠路程",getX(0.6),getY(0.53),0.6,0.7,getH(0.075),false,1);
}],
[68000, function(){//2.5
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0x345234,1,lyricSize*0.4,lyricSize*0.4,2,1,false,false);
	stringIn("能　感　受　到　它　的　到　来",getX(0.2),getY(0.3),0xFBFEFB,[filter],lyricSize,2.5,EPSILON,[false,9,10,-PI/2]);
	singleRandFly("*",[getX(0.1),getY(0.95),getX(0.65),getY(0.95)],getH(0.05),2,9,[1.00*PI,getH(0.4),2,0xFBFEFB,getH(0.1),[filter],0],[0,0.5,0.2,0.2]);
	singleRandFly("*",[getX(0.1),getY(1.05),getX(0.65),getY(1.05)],getH(0.05),2,9,[1.00*PI,getH(0.4),2,0xFBFEFB,getH(0.05),[filter],0],[0,0.5,0.2,0.2]);
}],
[71000, function(){//8
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0xEAAF58,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	//stringIn("亿　万　星　辰　消　逝　于　远　方",getX(0.1) + 5*lyricSize,getY(0.8),0xFFFFFF,[filter],lyricSize,6,7,[true,2,10,0]);
	singleRandFly("☆",[getX(0.2),getY(0.8),getX(0.8),getY(0.8)],0,6,30,[0,getH(0.2),1,0xFFFFFF,lyricSize,null,0],[0,0.5,0.2,0.2]);
	stringLine("亿　万　星　辰　消　逝　于　远　方",[getX(0.5),getY(0.8),0,lyricSize],0xFFFFFF,[filter],lyricSize,5.5,1.15,[false,0.9,0,true,false]);
}],
[71300, function(){
	stringFlash("１６强ＶＳ凉宫春日",getX(0.6),getY(0.53),0.7,0.7,getH(0.075),false,1);
}],
[73200, function(){
	drawUp(getX(ux),getY(uy),0.5,0x777777,1.5,getH(uw),getH(uh),getH(ub),[true,true,true,true,true]);
	drawRightUp(getX(ux),getY(uy),0.7,0xFF0000,0.5,getH(uw),getH(uh),getH(ub),1.5);

	showImage($G._get('SUZUMIYA'),getX(hx1),getY(hy),getH(hh),1.5+0.5,ia2);
	showImage($G._get('KANADE'),getX(hx2),getY(hy),getH(hh),2,null);
	
	var numh = getH(nh);
	var filter = $.createGlowFilter(nf,1,numh*0.4,numh*0.4,1,1,false,false);
	addNumber(getX(nx1),getY(ny),0.5,1-nb,0,3095,numh,nc,[filter]);
	addNumber(getX(nx2),getY(ny),0.5,1.5-nb,0,6223,numh,nc,[filter]);
}],
[75800, function(){
	stringFlash("８强ＶＳ仲村由理",getX(0.2),getY(0.53),0.7,0.7,getH(0.075),false,1);
}],
[76900, function(){
	drawUp(getX(ux),getY(uy),0.5,0x777777,1.5,getH(uw),getH(uh),getH(ub),[true,true,true,true,true]);
	drawRightUp(getX(ux),getY(uy),0.7,0xFF0000,0.5,getH(uw),getH(uh),getH(ub),1.5);

	showImage($G._get('YURI'),getX(hx1),getY(hy),getH(hh),1.5+0.5,ia2);
	showImage($G._get('KANADE'),getX(hx2),getY(hy),getH(hh),2,null);

	var numh = getH(nh);
	var filter = $.createGlowFilter(nf,1,numh*0.4,numh*0.4,1,1,false,false);
	addNumber(getX(nx1),getY(ny),0.5,1-nb,0,2362,numh,nc,[filter]);
	addNumber(getX(nx2),getY(ny),0.5,1.5-nb,0,7851,numh,nc,[filter]);
}],
[79000, function(){//3
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0xEAAF58,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	stringIn("目　送　着",getX(0.5) - 2.5*lyricSize,getY(0.8),0xFFFFFF,[filter],lyricSize,1,3,[true,2,10,0]);
}],
[79000, function(){
	stringFlash("半决赛ＶＳ五更琉璃",getX(0.6),getY(0.53),0.7,0.7,getH(0.075),false,1);
}],
[80200, function(){
	drawUp(getX(ux),getY(uy),0.5,0x777777,1.5,getH(uw),getH(uh),getH(ub),[true,true,true,true,true]);
	drawRightUp(getX(ux),getY(uy),0.7,0xFF0000,0.5,getH(uw),getH(uh),getH(ub),1.5);

	showImage($G._get('GOKORURI'),getX(hx1),getY(hy),getH(hh),1.5+0.5,ia2);
	showImage($G._get('KANADE'),getX(hx2),getY(hy),getH(hh),2,null);

	var numh = getH(nh);
	var filter = $.createGlowFilter(nf,1,numh*0.4,numh*0.4,1,1,false,false);
	addNumber(getX(nx1),getY(ny),0.5,1-nb,0,3438,numh,nc,[filter]);
	addNumber(getX(nx2),getY(ny),0.5,1.5-nb,0,7594,numh,nc,[filter]);
}],
[82000, function(){//4
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0xEAAF58,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	stringOut("挥　着　手",getX(0.5) - 2.5*lyricSize,getY(0.8),0xFFFFFF,[filter],lyricSize,1,1,[true,2,10,0]);
}],
[82500, function(){
	stringFlash("决赛ＶＳ优克里伍德",getX(0.5),getY(0.63),0.7,0.7,getH(0.075),false,1);
}],
[83700, function(){
	//drawUp(getX(ux),getY(uy),0.5,0x777777,2,getH(uw),getH(uh),getH(ub),[true,true,true,true,true]);
	//drawRightUp(getX(ux),getY(uy),0.7,0xFF0000,0.5,getH(uw),getH(uh),getH(ub),1.5);

	showImage($G._get('EUCLIWOOD'),getX(hx1),getY(hy),getH(hh),1.5+0.5,ia2);
	showImage($G._get('KANADE'),getX(hx2),getY(hy),getH(hh),2,null);

	var numh = getH(nh);
	var filter = $.createGlowFilter(nf,1,numh*0.4,numh*0.4,1,1,false,false);
	addNumber(getX(nx1),getY(ny),0.5,1-nb,0,4485,numh,nc,[filter]);
	addNumber(getX(nx2),getY(ny),0.5,1.5-nb,0,9064,numh,nc,[filter]);
}],
[84700, function(){
	showImage($G._get('CROWN'),getX(hx2),getY(hy)-getH(hh*0.87),getH(hh*0.73),1,{alpha:newMotion(0,1,0,0.5)});
}],
[85000, function(){//4
	var lyricSize = getH(0.06);
	var filter = $.createGlowFilter(0xEAAF58,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	stringIn("「太好了呢」",getX(0.5) - 3*lyricSize,getY(0.83),0xFFFFFF,[filter],lyricSize,2,6,[true,2,5,-PI/2]);
}],
[85900, function(){
	stringFlash("最后的最后",getX(0.3),getY(0.4),0.7,0.7,getH(0.075),false,1);
}],
[87700, function(){
	var cax = getX(0.5);
	var cay = getY(0.5);
	var cah = getH(0.4);
	var bias = -cah * 0.5 - getH(0.2);
	var lyricSize = getH(0.06);

	var ca = showImage($G._get('ELIMINATION'),cax,cay,cah,3,ia1);
	var filter = $.createGlowFilter(0x0E2534,1,lyricSize*0.4,lyricSize*0.4,1,1,false,false);
	//stringArc("最后恭喜小奏获得萌王！谢谢大家的观看！",cax,cay,cah*1.2,[-PI*0.4,PI*0.4],0xF0FCAB,[filter],lyricSize,1,3,[true,true,0,false]);
	stringLine("最后恭喜小奏获得萌王！谢谢大家的观看！",[cax,cay+bias,0,lyricSize],0xF0FCAB,[filter],lyricSize,1,3,[true,0.8,0,true,false]);
}],
[89000, function(){
	var cax = getX(0.5);
	var cay = getY(0.5);
	var cah = getH(0.4);
	var bias = -cah * 0.5 - getH(0.2);
	var lyricSize = getH(0.06);

	var l = lyricSize * 8.5;
	var filter = $.createGlowFilter(0xFFFFFF,1,lyricSize*0.8,lyricSize*0.8,7,1,false,false);
	//stringArc("最后恭喜小奏获得萌王！谢谢大家的观看！",cax,cay,cah*1.2,[-PI*0.4,PI*0.4],0xFFFFFF,[filter],lyricSize,1,EPSILON,[false,true,0,false]);
	singleRandFly("★",[cax-l-lyricSize,cay+bias,cax+l,cay+bias],0,1.5,40,[0,getH(0.1),0.5,0xF5FEC0,lyricSize*0.5,null,0,0.5],[1,0.1,0,0]);
}]
];
setSchedule(schedule);

