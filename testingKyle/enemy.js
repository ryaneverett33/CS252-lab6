function Enemy(floorPosY, canvasWidth) {
	var color = "red";
	var radius = 25;
	var centerX = 800;
	var centerY = floorPosY - radius - 10;
	var speed = 5;

	this.update = function() {
		centerX -= 5;
	}

	this.draw = function(canvas) {
		canvas.beginPath();
		canvas.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		canvas.fillStyle = color;
		canvas.fill();
		canvas.lineWidth = 5;
		canvas.strokeStyle = "black";
		canvas.stroke();
	}
}