function RivalPlayer(floorPosY) {
	this.posX = 100;
	this.posY = floorPosY;
	var velX =  0;
	this.velY = 0;
	var jumpVel = 12;
	var gravity = 0.5;
	var spriteSheet = new Image();
	spriteSheet.src = "spriteSheets/dino3.png";

	var scale = 4;
	var spritePosX = 76;
	var spritePosY = 4;
	var spriteStandWidth = 15;
	var spriteStandHeight = 17;
	var spriteCroutchWidth = 18;
	var spriteCroutchHeight = 15;
	var currSpriteWidth = spriteStandWidth;
	var currSpriteHeight = spriteStandHeight;
	this.currWidth = spriteStandWidth * scale;
	this.currHeight = spriteStandHeight * scale;

	this.jump = function() {
		this.velY = -jumpVel;
	}

	this.update = function() {
		this.velY += gravity;

		this.posX += velX;
		this.posY += this.velY;

		if(this.posY > floorPosY) {
			this.posY = floorPosY;
			this.velY = 0;
		}
	}


	this.draw = function() {
		canvas.drawImage(spriteSheet,
			spritePosX,
			spritePosY,
			currSpriteWidth,
			currSpriteHeight,
			this.posX,
			this.posY - this.currHeight,
			this.currWidth,
			this.currHeight);
	}
}