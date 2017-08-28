function ItemCell(name) {
	PIXI.Container.call( this );
	this.init(name);
}

ItemCell.prototype = Object.create(PIXI.Container.prototype);
ItemCell.prototype.constructor = ItemCell;

ItemCell.prototype.init = function(value) {
	this._selected = false;
	this._lock = false;
	
	this.cell = addAnim("icons");
	this.addChild(this.cell);
	this.sprite = this.cell.img;
	
	var size = 92;
	this.over = new PIXI.Graphics();
	this.over.beginFill(0xFFF7D2).drawRect(-size/2, -size/2, size, size).endFill();
	this.addChild(this.over);
	this.over.visible = false;
	
	this.w = this.cell.w;
	this.h = this.cell.h;
}
