var _W = 400;
var _H = 400;
var dataAnima = [];
var dataMovie = [];
var scrContainer;
var ScreenGame;
var renderer, stage, preloader; // pixi;
var sprites_loaded = false;

function init() {
	if(typeof console === "undefined"){ console = {}; }
	
	// hide scroll
	var s=document.documentElement.style;
	s.cssText=s.cssText?'':'overflow:hidden;width:100%;height:100%';
	// document.body.scroll = "no";
	
	//initialize the stage
	renderer = PIXI.autoDetectRenderer(_W, _H);
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();
	
	update();
	
	scrContainer = new PIXI.Container();
	stage.addChild(scrContainer);;
	
	loadManifest();
}

function loadManifest(){
	preloader = new PIXI.loaders.Loader();
	
	preloader.add("icons", "images/icons.png");
	
	//сохраняем счетчик кол-ва файлов для загрузки
	preloader.on("progress", handleProgress);
	preloader.load(handleComplete);
}

function spritesLoad() {
	if(sprites_loaded){
		return true;
	}
	sprites_loaded = true;
	
	var img, data;
	
	var base = PIXI.utils.TextureCache["images/icons.png"];
	var texture0 = new PIXI.Texture(base);
	texture0.frame = new PIXI.Rectangle(0, 0, 100, 100);
	var texture1 = new PIXI.Texture(base);
	texture1.frame = new PIXI.Rectangle(100, 0, 100, 100);
	var texture2 = new PIXI.Texture(base);
	texture2.frame = new PIXI.Rectangle(200, 0, 100, 100);
	data = [texture0, texture1, texture2];
	dataMovie["icons"] = data;
}

function handleProgress(){
	var percent = preloader.progress
}

function handleComplete(evt) {
	spritesLoad();
	
	start();
}

function getTimer(){
	var d = new Date();
	var n = d.getTime();
	return n;
}

function update() {
	if(ScreenGame){
		ScreenGame.update();
	}
	
	requestAnimationFrame(update);
	renderer.render(stage);
}

function removeSelf(obj) {
	if (obj) {
		if (obj.parent.contains(obj)) {
			obj.parent.removeChild(obj);
		}
	}
}

function start() {
	showGame();
}

function showGame() {
	ScreenGame = new ScrGame();
	scrContainer.addChild(ScreenGame);
}

function addObj(name, _x, _y, _scGr, _scaleX, _scaleY) {
	if(_x){}else{_x = 0};
	if(_y){}else{_y = 0};
	if(_scGr){}else{_scGr = 1};
	if(_scaleX){}else{_scaleX = 1};
	if(_scaleY){}else{_scaleY = 1};
	var obj = new PIXI.Container();
	obj.scale.x = _scGr*_scaleX;
	obj.scale.y = _scGr*_scaleY;
	
	var objImg = null;
	if(dataAnima[name]){
		objImg = new PIXI.Sprite(dataAnima[name]);
	} else if(dataMovie[name]){
		objImg = new PIXI.extras.MovieClip(dataMovie[name]);
		objImg.stop();
	}else{
		var data = preloader.resources[name];
		if(data){
			objImg = new PIXI.Sprite(data.texture);
		} else {
			return null;
		}
	}
	objImg.anchor.x = 0.5;
	objImg.anchor.y = 0.5;
	obj.w = objImg.width*obj.scale.x;
	obj.h = objImg.height*obj.scale.y;
	obj.addChild(objImg);
	obj.x = _x*_scGr;
	obj.y = _y*_scGr;
	obj.name = name;
	obj.img = objImg;
	obj.r = obj.w/2;
	obj.rr = obj.r*obj.r;
	
	return obj;
}

function addAnim(name, _x, _y, _scGr, _scaleX, _scaleY) {
	return addObj(name, _x, _y, _scGr, _scaleX, _scaleY);
}

function get_dd(p1, p2) {
	var dx=p2.x-p1.x;
	var dy=p2.y-p1.y;
	return dx*dx+dy*dy;
}
function getDD(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	return dx*dx+dy*dy;
}
function hit_test(mc,rr,tx,ty) {
	var dx = mc.x - tx;
	var dy = mc.y - ty;
	var dd = dx*dx+dy*dy;
	if(dd<rr){
		return true
	}
	return false
}

function hit_test_rec(mc, w, h, tx, ty) {
	if(tx>mc.x-w/2 && tx<mc.x+w/2){
		if(ty>mc.y-h/2 && ty<mc.y+h/2){
			return true;
		}
	}
	return false;
}


