function GameManager() {
	var width = canvasElement.getAttribute("width");
	var height = canvasElement.getAttribute("height");

	var FPS = 60;
	var floorPosY = 450;

	Input.getInstance().init(canvasElement);

	var enemyManager = new EnemyManager(floorPosY, width);
	var player = new Player(floorPosY);

	function update() {
		switch(gameState) {
			case "manu":
				break;
			case "singlePlayer":
				if(Input.getInstance().isKeyPressed(49)) {
					enemyManager.spawnFloorEnemy();
				}

				if(Input.getInstance().isKeyPressed(50)) {
					enemyManager.spawnArielEnemy();
				}

				enemyManager.update(player.posX, player.posY - player.currHeight, player.width, player.currHeight);
				player.update();

				break;
			case "singlePlayerDeath":

		}
			
		Input.getInstance().clear();
	}

	this.draw = function() {
		switch(gameState) {
			case "menu":
				break;
			case "singlePlayer":
				canvas.clearRect(0, 0, width, height);

				enemyManager.draw();
				player.draw();

				//ground
				canvas.beginPath();
				canvas.moveTo(0, floorPosY);
				canvas.lineTo(width, floorPosY);
				canvas.lineWidth = 5;
				canvas.stroke();

				break;
		}
	}

	this.start = function() {
		setInterval(function() {
			update();
			gameManager.draw();
		}, 1000 / FPS);
	}

	this.reset = function() {
		player.posY = floorPosY;
		enemyManager.enemies.length = 0;
	}
}