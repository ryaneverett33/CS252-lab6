function GameManager() {
	var width = canvasElement.getAttribute("width");
	var height = canvasElement.getAttribute("height");

	var state; //mainMenu, singlePlayer, singlePlayerDeathMenu
	var FPS = 60;
	var floorPosY = 450;
	var score = 0;
	var increaseScoreInterval = 1; //seconds
	var scoreIntervalRet;

	Input.getInstance().init(canvasElement);

	var enemyManager = new EnemyManager(floorPosY, width);
	var player = new Player(floorPosY);

	function increaseScore() {
		score++;
		document.getElementById("score").innerHTML = "Score: " + score;

		if(score % 10 == 0 && score < 60) {
			enemyManager.speed += 2;
			enemyManager.minTime -= 200;
		}
	}

	this.setState =  function(newState) {
		state = newState;

		switch(state) {
			case "mainMenu":
				document.getElementById("singlePlayerDeathMenu").style.display = "none";
				document.getElementById("score").style.display = "none";
				document.getElementById("mainMenu").style.display = "block";

				break;
			case "singlePlayer":
				player.posY = floorPosY;
				player.velY = 0;
				enemyManager.init();
				score = 0;
				scoreIntervalRet = setInterval(increaseScore, 1000 * increaseScoreInterval);
				document.getElementById("score").style.display = "block";
				document.getElementById("score").innerHTML = "Score: 0";
				document.getElementById("mainMenu").style.display = "none";
				document.getElementById("singlePlayerDeathMenu").style.display = "none";
				canvasElement.focus();

				break;
			case "singlePlayerDeathMenu":
				document.getElementById("singlePlayerDeathMenu").style.display = "block";
				window.clearInterval(scoreIntervalRet);

				break;

		}
	}

	function update() {
		switch(state) {
			case "singlePlayer":
				enemyManager.update(player.posX, player.posY - player.currHeight, player.width, player.currHeight);
				player.update();

				break;
			case "singlePlayerDeath":

		}
			
		Input.getInstance().clear();
	}

	this.draw = function() {
		switch(state) {
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