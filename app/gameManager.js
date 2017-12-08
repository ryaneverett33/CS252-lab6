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
	var that = this;

	Input.getInstance().init(canvasElement);

	var enemyManager = new EnemyManager(floorPosY, width);
	var player = new Player(floorPosY);
	var rivalPlayer = new RivalPlayer(floorPosY);

	socket.on('Match.playerUpdate', function(playerObj) {
        console.log('playerUpdate', playerObj);

        switch(playerObj.action) {
        	case "jump":
        		rivalPlayer.jump();
        		break;
        	case "hit":
        		that.setState("MultiplayerDeathMenu");
        		document.getElementById('notfication').style.display = 'none';
        		break;
        	case "duck":
        		rivalPlayer.duck();
        		break;
        	case "ducked":
        		rivalPlayer.doneDuck();
        		break;
        }
    });

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

	/*function multDeathMenuSetup() {
		document.getElementById("MultiplayerDeathMenu").style.display = "block";
		window.clearInterval(scoreIntervalRet);
		console.log("GAME OVER");

		if (newHS) {
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
		}
		if (won) {
			console.log("ADDING WIN");
			$(document).ready(function(){
				var wins = parseInt(/\d+/.exec(document.getElementById("wins").innerHTML));
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
				request.send(JSON.stringify({ "column": "Wins", "value": wins, "cookie": document.cookie.split("=")[1] }));		
			});
		}
	}*/

	this.setState =  function(newState, seed) {
		state = newState;

		switch(state) {
			case "mainMenu":
				document.getElementById("singlePlayerDeathMenu").style.display = "none";
				document.getElementById("score").style.display = "none";
				document.getElementById("hs").style.display = "none";
				document.getElementById("wins").style.display = "none";
				document.getElementById("opWins").style.display = "none";
				document.getElementById('notfication').style.display = 'none';


				document.getElementById("mainMenu").style.display = "block";
				document.getElementById("MultiplayerDeathMenu").style.display = "none";
				canvas.clearRect(0, 0, width, height);

				break;
			case "singlePlayer":
				updateStats();
				player.posY = floorPosY;
				player.velY = 0;
				enemyManager.init(state, seed);
				score = 0;
				scoreIntervalRet = setInterval(increaseScore, 1000 * increaseScoreInterval);
				document.getElementById("score").style.display = "block";
				document.getElementById("score").innerHTML = "Score: 0";
				document.getElementById("hs").style.display = "block";
				//document.getElementById("wins").style.display = "block";

				document.getElementById("mainMenu").style.display = "none";
				document.getElementById("singlePlayerDeathMenu").style.display = "none";
				canvasElement.focus();

				break;
			case "Multiplayer":
				updateStats();
				player.posY = floorPosY;
				player.velY = 0;
				enemyManager.init(state, seed);
				score = 0;
				clearInterval(scoreIntervalRet);
				scoreIntervalRet = setInterval(increaseScore, 1000 * increaseScoreInterval);
				document.getElementById("score").style.display = "block";
				document.getElementById("score").innerHTML = "Score: 0";
				document.getElementById("hs").style.display = "block";
				document.getElementById("wins").style.display = "block";
				document.getElementById("opWins").style.display = "block";


				document.getElementById("mainMenu").style.display = "none";
				document.getElementById("singlePlayerDeathMenu").style.display = "none";
				canvasElement.focus();

				break;
			case "singlePlayerDeathMenu":
				document.getElementById("singlePlayerDeathMenu").style.display = "block";
				window.clearInterval(scoreIntervalRet);
				if (newHS) {
					console.log("GAME OVER, SETTING NEW HS");
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
						request.open("POST", "http://dinodash.azurewebsites.net/user/set");
						//request.open("POST", "http://localhost:1337/user/set");

						request.send(JSON.stringify({ "column": "HighScore", "value": score.toString(), "cookie": document.cookie.split("=")[1] }));		
					});
				}
				break;
		    case "MultiplayerDeathMenu":
				document.getElementById("MultiplayerDeathMenu").style.display = "block";
				window.clearInterval(scoreIntervalRet);
				console.log("GAME OVER");

				if (newHS) {
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
						request.open("POST", "http://dinodash.azurewebsites.net/user/set");
						//request.open("POST", "http://localhost:1337/user/set");

						request.send(JSON.stringify({ "column": "HighScore", "value": score.toString(), "cookie": document.cookie.split("=")[1] }));		
					});
				}
				/*if (won) {
					console.log("ADDING WIN");
					$(document).ready(function(){
						var wins = parseInt(/\d+/.exec(document.getElementById("wins").innerHTML));
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
						request.send(JSON.stringify({ "column": "Wins", "value": wins, "cookie": document.cookie.split("=")[1] }));		
					});
				}*/

		}
	}
	function updateStats() {
		var request = new XMLHttpRequest();
		request.addEventListener("load", function () {
			var recieved = this.responseText;
			var json = JSON.parse(recieved);
			hs = json.highscore;
			wins = json.wins;
			if(request.status === 200) { //200 status = success
				document.getElementById("hs").innerHTML = "Highscore = " + hs
				document.getElementById("wins").innerHTML = "Wins = " + wins;


			} else { //invalid login credentials
				document.getElementById("hs").innerHTML = "Highscore = N.A.";
				document.getElementById("wins").innerHTML = "Wins = N.A.";
			}
		});
		request.open("POST", "http://dinodash.azurewebsites.net/user/get");
		//request.open("POST", "http://localhost:1337/user/get");
		request.send(JSON.stringify({ "cookie": document.cookie.split("=")[1] }));

		if (state == "Multiplayer") {
			var request2 = new XMLHttpRequest();
			var opponent_cookie = document.getElementById("opp_cookie").innerHTML;

			request2.addEventListener("load", function () {
				var recieved = this.responseText;
				var json = JSON.parse(recieved);
				hs = json.highscore;
				wins = json.wins;
				if(request2.status === 200) { //200 status = success
					document.getElementById("opWins").innerHTML = "Opponent Wins = " + wins;
				} else { //invalid login credentials
					document.getElementById("opWins").innerHTML = "Opponent Wins = N.A.";
				}
			});
			request2.open("POST", "http://dinodash.azurewebsites.net/user/get");
			//request.open("POST", "http://localhost:1337/user/get");
			request2.send(JSON.stringify({ "cookie": opponent_cookie }));
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
				rivalPlayer.update();
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
				rivalPlayer.draw();
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