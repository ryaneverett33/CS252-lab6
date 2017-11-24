function Player(floorPosY) {
	var posX = 100;
	var posY = 100;
	var velX =  0;
	var velY = 0;
	var width = 50;
	var height = 100;
	var color = "blue";
	var gravity = 0.5;

	this.update = function() {
		if(Input.getInstance().isKeyPressed(32)) {
			velY = -10;
		}

		velY += gravity;

		posX += velX;
		posY += velY;

		if(posY + height > floorPosY) {
			posY = floorPosY - height;
			velY = 0;
		}
	}

	this.draw = function(canvas) {
		canvas.fillStyle = color;
		canvas.fillRect(posX, posY, width, height);
	}
}