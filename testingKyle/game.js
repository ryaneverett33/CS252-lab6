function Game() {
	var canvasElement = document.getElementById("canvas");
	var canvas = canvasElement.getContext("2d");
	var width = canvasElement.getAttribute("width");
	var height = canvasElement.getAttribute("height");
	canvasElement.focus();

	var FPS = 60;

	Input.getInstance().init(canvasElement);

	var player = new Player();

	function update() {
		player.update();

		Input.getInstance().clear();
	}

	function draw() {
		canvas.clearRect(0, 0, width, height);

		player.draw(canvas);
	}

	this.start = function() {
		setInterval(function() {
			update();
			draw();
		}, 1000 / FPS);
	}
}