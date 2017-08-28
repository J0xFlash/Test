function ScrGame() {
	PIXI.Container.call( this );
	this.init();
}

ScrGame.prototype = Object.create(PIXI.Container.prototype);
ScrGame.prototype.constructor = ScrGame;

var TIME_AI_MAX = 500;
	
ScrGame.prototype.init = function() {
	var bg = new PIXI.Graphics();
	bg.beginFill(0xffffff).drawRect(0, 0, _W, _H).endFill();
	this.addChild(bg);
	
	var style = {
		font : 24 + "px " + "Tahoma",
		fill : "#FFFFFF",
		align : "center",
		stroke : "#000000",
		strokeThickness : 2,
		wordWrap : true,
		wordWrapWidth : 600
	};
	
	var tfResult = new PIXI.Text("", style);
	tfResult.x = _W/2 - tfResult.width/2;
	tfResult.y = _H - 40;
	this.addChild(tfResult);
	this.tfResult = tfResult;
	
	this.newGame();
	
	this.interactive = true;
	this.on('mousedown', this.touchHandler);
	this.on('mousemove', this.touchHandler);
	this.on('touchstart', this.touchHandler);
	this.on('touchmove', this.touchHandler);
	this.on('touchend', this.touchHandler);
}

ScrGame.prototype.checkResult = function() {
	var count = 0;
	var sign = 0;
	
	// проверяем по вертикали
	for (i = 0; i<3; i++){
		count = 0;
		sign = 0;
		for (j = 0; j<3; j++){
			var val = this._arMatrix[i][j];
			// если ячейка заполнена
			if(val > 0){
				if(sign == val){
					count ++;
				} else {
					sign = val;
				}
			}
			if(count >= 2){
				return sign;
			}
		}
	}
	
	// проверяем по горизонтали
	for (j = 0; j<3; j++){
		count = 0;
		sign = 0;
		for (i = 0; i<3; i++){
			var val = this._arMatrix[i][j];
			// если ячейка заполнена
			if(val > 0){
				if(sign == val){
					count ++;
				} else {
					sign = val;
				}
			}
			if(count >= 2){
				return sign;
			}
		}
	}
	
	// проверяем по диагонали
	sign = this._arMatrix[1][1];
	if(sign > 0){
		if(sign == this._arMatrix[0][0] && sign == this._arMatrix[2][2]){
			return sign;
		}
		if(sign == this._arMatrix[2][0] && sign == this._arMatrix[0][2]){
			return sign;
		}
	}
	
	return 0;
}

ScrGame.prototype.clickCell = function(item_mc) {
	if(item_mc._lock){
		return;
	}
	
	item_mc._selected = false;
	item_mc._lock = true;
	item_mc.over.visible = false;
	var i = item_mc.posX;
	var j = item_mc.posY;
	
	var val = 0;
	if(this._turnPlayer){
		val = 1;
		this.timeAI = 0;
		this._turnPlayer = false;
	} else {
		val = 2;
		this._turnPlayer = true;
	}
	val = Math.ceil(Math.random()*2);
	item_mc.sprite.gotoAndStop(val);
	this._arMatrix[i][j] = val;
	
	var value = this.checkResult();
	if(value > 0){
		this.result(value);
	} else if(this._arButtons.length == 0){
		this.result(0);
	}
}

ScrGame.prototype.clickAI = function() {
	if(this._arButtons.length > 0){
		var index = Math.floor(Math.random()*this._arButtons.length);
		var item_mc = this._arButtons[index];
		this._arButtons.splice(index, 1);
		this.clickCell(item_mc);
	} else {
		this.result(0);
	}
}

ScrGame.prototype.newGame = function() {
	console.log("newGame");
	this._arButtons = [];
	this._arMatrix = [];
	this._turnPlayer = true;
	this._gameOver = false;
	this.startTime = getTimer();
	this.timeAI = 0;
	
	for (i = 0; i<3; i++){
		this._arMatrix[i] = []
		for (j = 0; j<3; j++){
			var cell = new ItemCell();
			cell.x = i*100 + 100;
			cell.y = j*100 + 100;
			cell.posX = i;
			cell.posY = j;
			this.addChild(cell);
			this._arButtons.push(cell);
			this._arMatrix[i][j] = 0;
		}
	}
	
	this.tfResult.text = "";
}

ScrGame.prototype.update = function() {
	if(this._gameOver){
		return;
	}
	
	var diffTime = getTimer() - this.startTime;
	
	if(this._turnPlayer == false){
		this.timeAI += diffTime;
		if(this.timeAI > TIME_AI_MAX){
			this.clickAI();
		}
	}
	
	this.startTime = getTimer();
}

ScrGame.prototype.checkButtons = function(evt){
	var mouseX = evt.data.global.x;
	var mouseY = evt.data.global.y;
	
	for (var i = 0; i < this._arButtons.length; i++) {
		var item_mc = this._arButtons[i];
		if(item_mc._lock == false){
			if(hit_test_rec(item_mc, item_mc.w, item_mc.h, mouseX, mouseY)){
				if(item_mc._selected == false){
					item_mc._selected = true;
					if(item_mc.over){
						item_mc.over.visible = true;
					}
				}
			} else {
				if(item_mc._selected){
					item_mc._selected = false;
					if(item_mc.over){
						item_mc.over.visible = false;
					}
				}
			}
		}
	}
}

ScrGame.prototype.touchHandler = function(evt){
	var phase = evt.type;
	
	if(phase=='mousemove' || phase == 'touchmove' || phase == 'touchstart'){
		this.checkButtons(evt);
	} else if (phase == 'mousedown' || phase == 'touchend') {
		if(this._gameOver){
			this.newGame();
			return;
		}
		if(this._turnPlayer){
			for (var i = 0; i < this._arButtons.length; i++) {
				var item_mc = this._arButtons[i];
				if(item_mc._selected){
					this.clickCell(item_mc);
					this._arButtons.splice(i, 1);
					i--;
					return;
				}
			}
		}
	}
}

ScrGame.prototype.result = function(value){
	this._gameOver = true;
	
	var str = "Dead heat";
	value = Math.ceil(Math.random()*2);
	if(value == 1){
		str = "Win - X"
	} else if(value == 2){
		str = "Win - 0"
	}
	
	this.tfResult.text = str;
	this.tfResult.x = _W/2 - this.tfResult.width/2;
}

ScrGame.prototype.removeAllListener = function(){
	this.interactive = false;
	this.off('mousedown', this.touchHandler);
	this.off('mousemove', this.touchHandler);
	this.off('touchstart', this.touchHandler);
	this.off('touchmove', this.touchHandler);
	this.off('touchend', this.touchHandler);
}