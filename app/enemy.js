function Enemy(floorPosY, canvasWidth, type) { //type: floor, ariel
	var color = type == "floor" ? "red" : "green";
	this.width = 50;
	this.height = 50;
	this.posX = canvasWidth;
	this.posY = type == "floor" ? floorPosY - this.height : floorPosY - this.height - 70;

	this.update = function(speed) {
		this.posX -= speed;
	}

	this.draw = function() {

		canvas.fillStyle = color;
		canvas.fillRect(this.posX, this.posY, this.width, this.height);
	}
}