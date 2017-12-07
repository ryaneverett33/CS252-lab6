function Enemy(floorPosY, canvasWidth, type) { //type: floor, ariel
	var color = type == "floor" ? "red" : "green";
	var spritePosX = type == "floor" ? 507 : 0;
	var spritePosY = type == "floor" ? 5 : 0;
	var spriteWidth = type == "floor" ? 15 : 13;
	var spriteHeight = type == "floor" ? 16 : 11;
	var spriteSheet = new Image();
	spriteSheet.src = type == "floor" ? "spriteSheets/dino2.png" : "spriteSheets/fireball.png";
	var scale = 4;
	this.width = spriteWidth * scale;
	this.height = spriteHeight * scale;
	this.posX = canvasWidth;
	this.posY = type == "floor" ? floorPosY - this.height : floorPosY - this.height - 60;

	this.getBoundingBox = function() {
		var bb = {
			posX: type == "floor" ? this.posX + 6 * scale : this.posX + 2 * scale,
			posY: this.posY,
			width: type == "floor" ? 9 * scale : 9 * scale,
			height: this.height
		};

		return bb;
	}

	this.update = function(speed) {
		this.posX -= speed;
	}

	this.draw = function() {
		//canvas.fillStyle = color;
		//canvas.fillRect(this.posX, this.posY, this.width, this.height);
		canvas.drawImage(spriteSheet,
			spritePosX,
			spritePosY,
			spriteWidth,
			spriteHeight,
			this.posX,
			this.posY,
			this.width,
			this.height);
	}
}