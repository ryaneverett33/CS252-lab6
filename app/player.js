function Player(floorPosY) {
	this.posX = 100;
	this.posY = floorPosY;
	var velX =  0;
	this.velY = 0;
	var jumpVel = 12;
	var gravity = 0.5;
	var onFloor = false;
	var spriteSheet = new Image();
	spriteSheet.src = "spriteSheets/dino1.png";

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

	this.getBoundingBox = function() {
		var bb = {
			posX: this.posX + 2 * scale,
			posY: this.posY,
			width: 12 * scale,
			height: this.currHeight
		};

		return bb;
	}

	this.update = function(state) {
		if(onFloor && Input.getInstance().isKeyPressed(38)) {
			this.velY = -jumpVel;
			onFloor = false;
			if (state == "Multiplayer") {
				var roomid = document.getElementById("roomid").innerHTML;
				var cookie = document.cookie.split("=")[1];
				console.log("ROOM ID: " + document.getElementById('roomid').innerHTML);
				console.log("OBJ: " + {roomid : roomid, username : cookie, action : "jump"});
				socket.emit('Player.jump', {roomid : roomid, username : cookie, action : "jump"});
				console.log("SENT JUMP");
			}
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

			if (state == "Multiplayer") {
				var roomid = document.getElementById("roomid").innerHTML;
				var cookie = document.cookie.split("=")[1];
				console.log("ROOM ID: " + document.getElementById('roomid').innerHTML);
				console.log("OBJ: " + {roomid : roomid, username : cookie, action : "duck"});
				socket.emit('Player.duck', {roomid : roomid, username : cookie, action : "duck"});
				console.log("SENT DUCK");

			}
		}

		if(wasCroutching && !isCroutching) {
			spritePosX = 76;
		}

		wasCroutching = isCroutching;
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