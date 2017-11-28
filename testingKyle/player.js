function Player(floorPosY) {
	this.posX = 100;
	this.posY = floorPosY;
	var velX =  0;
	this.velY = 0;

	this.width = 50;
	var standHeight = 100;
	var croutchHeight = 50;
	this.currHeight = standHeight;
	var color = "blue";
	var gravity = 0.5;
	var onFloor = false;

	this.update = function() {
		if(onFloor && Input.getInstance().isKeyPressed(38)) {
			this.velY = -10;
			onFloor = false;
		}

		this.currHeight = standHeight;
		if(Input.getInstance().isKeyHeld(40)) {
			this.currHeight = croutchHeight;
		}

		this.velY += gravity;

		this.posX += velX;
		this.posY += this.velY;

		if(this.posY > floorPosY) {
			this.posY = floorPosY;
			this.velY = 0;

			onFloor = true;
		}
	}

	this.draw = function() {
		canvas.fillStyle = color;
		canvas.fillRect(this.posX, this.posY - this.currHeight, this.width, this.currHeight);
	}
}