function Enemy(floorPosY, canvasWidth, type) {
	var color = type == "floor" ? "red" : "green";
	this.width = 50;
	var height = 50;
	this.posX = canvasWidth;
	var posY = type == "floor" ? floorPosY - height : floorPosY - height - 70;
	var speed = 5;

	this.update = function() {
		this.posX -= 5;
	}

	this.draw = function(canvas) {
		canvas.fillStyle = color;
		canvas.fillRect(this.posX, posY, this.width, height);
	}
}