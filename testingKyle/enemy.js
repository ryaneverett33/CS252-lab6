function Enemy(floorPosY, canvasWidth) {
	var color = "red";
	this.radius = 25;
	this.centerX = 800;
	this.centerY = floorPosY - this.radius - 10;
	var speed = 5;

	this.update = function() {
		this.centerX -= 5;
	}

	this.draw = function(canvas) {
		canvas.beginPath();
		canvas.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
		canvas.fillStyle = color;
		canvas.fill();
		canvas.lineWidth = 5;
		canvas.strokeStyle = "black";
		canvas.stroke();
	}
}