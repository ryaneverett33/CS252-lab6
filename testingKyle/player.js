function Player(floorPosY) {
	this.posX = 100;
	this.posY = floorPosY;
	var velX =  0;
	this.velY = 0;
	var jumpVel = 12;
	var color = "blue";
	var gravity = 0.5;
	var onFloor = false;
	var spriteSheet = new Image();
	spriteSheet.src = "../sprite_sheets/dino1.png";

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

	var currTicks = 0;
	var wasCroutching = false;

	this.update = function() {
		if(onFloor && Input.getInstance().isKeyPressed(38)) {
			this.velY = -jumpVel;
			onFloor = false;
		}

		var isCroutching = false;
		this.currWidth = spriteStandWidth * scale;
		this.currHeight = spriteStandHeight * scale;
		currSpriteWidth = spriteStandWidth;
		currSpriteHeight = spriteStandHeight;
		if(onFloor && Input.getInstance().isKeyHeld(40)) {
			this.currWidth = spriteCroutchWidth * scale;
			this.currHeight = spriteCroutchHeight * scale;
			currSpriteWidth = spriteCroutchWidth;
			currSpriteHeight = spriteCroutchHeight;
			isCroutching = true;
		}

		this.velY += gravity;

		this.posX += velX;
		this.posY += this.velY;

		if(this.posY > floorPosY) {
			this.posY = floorPosY;
			this.velY = 0;

			onFloor = true;
		}

		currTicks += 1;
		if(currTicks > 4) {
			currTicks = 0;

			spritePosX += 24;

			if(!isCroutching) {
				if(spritePosX == 196) {
					spritePosX = 76;
				}
			}
			else {
				if(spritePosX == 558) {
					spritePosX = 414;
				}
			}
		}

		if(!wasCroutching && isCroutching) {
			spritePosX = 414;
			console.log("1");
		}

		if(wasCroutching && !isCroutching) {
			spritePosX = 76;
			console.log("2");
		}

		wasCroutching = isCroutching;
	}

	this.draw = function() {
		//canvas.fillStyle = color;
		//canvas.fillRect(this.posX, this.posY - this.currHeight, this.width, this.currHeight);
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