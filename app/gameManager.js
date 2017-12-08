function GameManager() {
	var width = canvasElement.getAttribute("width");
	var height = canvasElement.getAttribute("height");

	var state; //mainMenu, singlePlayer, singlePlayerDeathMenu
	var FPS = 60;
	var floorPosY = 450;
	var score = 0;
	var increaseScoreInterval = 1; //seconds
	var scoreIntervalRet;
	//var highscore_string = document.getElementById("hs").innerHTML;
	//parseInt("10") + "<br>";
	//console.log(highscore);
	var newHS = false;

	Input.getInstance().init(canvasElement);

	var enemyManager = new EnemyManager(floorPosY, width);
	var player = new Player(floorPosY);

	function increaseScore() {
		score++;
		var highscore = parseInt(/\d+/.exec(document.getElementById("hs").innerHTML));
		document.getElementById("score").innerHTML = "Score: " + score;
		if (score > highscore) {
			highscore = score;
			document.getElementById("hs").innerHTML = "Highscore: " + score;
			newHS = true;
		}


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
				document.getElementById("hs").style.display = "none";
				document.getElementById("wins").style.display = "none";
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
				document.getElementById("hs").style.display = "block";
				document.getElementById("wins").style.display = "block";

				document.getElementById("mainMenu").style.display = "none";
				document.getElementById("singlePlayerDeathMenu").style.display = "none";
				canvasElement.focus();

				break;
			case "Multiplayer":
				player.posY = floorPosY;
				player.velY = 0;
				enemyManager.init();
				score = 0;
				scoreIntervalRet = setInterval(increaseScore, 1000 * increaseScoreInterval);
				document.getElementById("score").style.display = "block";
				document.getElementById("score").innerHTML = "Score: 0";
				document.getElementById("hs").style.display = "block";
				document.getElementById("wins").style.display = "block";

				document.getElementById("mainMenu").style.display = "none";
				document.getElementById("singlePlayerDeathMenu").style.display = "none";
				canvasElement.focus();

				break;
			case "singlePlayerDeathMenu":
				document.getElementById("singlePlayerDeathMenu").style.display = "block";
				window.clearInterval(scoreIntervalRet);
				if (newHS) {
					console.log("GAME OVER");
					//set new highscore in database
					$(document).ready(function(){
						var request = new XMLHttpRequest();
						request.addEventListener("load", function () {
							var recieved = this.responseText;
							var json = JSON.parse(recieved);
							if(request.status === 200) { //200 status = success
								console.log("Set user endpoint success");
							} else { //invalid login credentials
								console.log("Set user endpoint failure");
							}
						});
						//request.open("POST", "http://dinodash.azurewebsites.net/user/set");
						request.open("POST", "http://localhost:1337/user/set");

						request.send(JSON.stringify({ "column": "HighScore", "value": score.toString(), "cookie": document.cookie.split("=")[1] }));		
					});
				break;
				}
		}
	}

	function update() {
		switch(state) {
			case "singlePlayer":
				var playerBB = player.getBoundingBox();
				enemyManager.update(playerBB.posX, playerBB.posY - playerBB.height, playerBB.width, playerBB.height, state);
				player.update(state);

				break;
			case "Multiplayer":
				var playerBB = player.getBoundingBox();
				enemyManager.update(playerBB.posX, playerBB.posY - playerBB.height, playerBB.width, playerBB.height, state);
				player.update(state);
				//get player info

				//send to socketio

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
		

		case "Multiplayer":
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