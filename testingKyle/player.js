function Player(floorPosY) {
	var posX = 100;
	var posY = 100;
	var velX =  0;
	var velY = 0;
	var width = 50;
	var standHeight = 100;
	var croutchHeight = 50;
	var currHeight = standHeight;
	var color = "blue";
	var gravity = 0.5;
	var onFloor = false;

	this.update = function() {
		if(onFloor && Input.getInstance().isKeyPressed(38)) {
			velY = -10;
			onFloor = false;
		}

		currHeight = standHeight;
		if(Input.getInstance().isKeyHeld(40)) {
			currHeight = croutchHeight;
		}

		velY += gravity;

		posX += velX;
		posY += velY;

		if(posY > floorPosY) {
			posY = floorPosY;
			velY = 0;
			onFloor = true;
		}
	}

	this.draw = function(canvas) {
		canvas.fillStyle = color;
		canvas.fillRect(posX, posY - currHeight, width, currHeight);
	}
}