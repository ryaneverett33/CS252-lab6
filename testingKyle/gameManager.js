function GameManager() {
	var canvasElement = document.getElementById("canvas");
	var canvas = canvasElement.getContext("2d");
	var width = canvasElement.getAttribute("width");
	var height = canvasElement.getAttribute("height");
	canvasElement.focus();

	var FPS = 60;
	var floorPosY = 450;

	Input.getInstance().init(canvasElement);

	var enemyManager = new EnemyManager(floorPosY, width);
	var player = new Player(floorPosY);

	function update() {
		if(Input.getInstance().isKeyPressed(81)) {
			enemyManager.spawnEnemy();
		}

		enemyManager.update();
		player.update();

		Input.getInstance().clear();
	}

	function draw() {
		canvas.clearRect(0, 0, width, height);

		enemyManager.draw(canvas);
		player.draw(canvas);

		//draw groud
		canvas.beginPath();
		canvas.moveTo(0, floorPosY);
		canvas.lineTo(width, floorPosY);
		canvas.lineWidth = 5;
		canvas.stroke();
	}

	this.start = function() {
		setInterval(function() {
			update();
			draw();
		}, 1000 / FPS);
	}
}