function EnemyManager(floorPosY, canvasWidth) {
	var that = this;
	var enemies = [];
	var ret;

	var initSpeed = 5;
	this.speed = this.initSpeed;

	var initMinTime = 1000;
	this.minTime = this.initMinTime;

	this.randInterval = 1000;

	var seed = 1;
	function random() {
		var x = Math.sin(seed++) * 10000;
		return x - Math.floor(x);
	}

	this.init = function(state, newSeed) {
		enemies.length = 0;
		clearInterval(ret);
		ret = setInterval(that.spawnEnemy(state), 1000);
		this.speed = initSpeed;
		this.minTime = initMinTime;

		if(state == "Multiplayer") {
			seed = newSeed;
		}
	}

	this.spawnEnemy = function() {
		//var rand = Math.random();
		var rand = random();

		if(rand > 0.5) {
			var e = new Enemy(floorPosY, canvasWidth, "floor");
			enemies.push(e);
		}
		else {
			var e = new Enemy(floorPosY, canvasWidth, "ariel");
			enemies.push(e);
		}

		clearInterval(ret);
		//ret = setInterval(that.spawnEnemy, that.minTime + Math.random() * that.randInterval);
		ret = setInterval(that.spawnEnemy, that.minTime + random() * that.randInterval);
		console.log(random());
	}

	this.update = function(playerPosX, playerPosY, playerWidth, playerHeight, state) {
		//must start from the end to avoid issues with removing enemy mid-iteration
		for(var i = enemies.length - 1; i >= 0; i--) {
			var e = enemies[i];

			if(e.posX + e.width < 0) {
				enemies.splice(i, 1);
				continue;
			}

			e.update(that.speed);

			var enemyBB = e.getBoundingBox();

			if(hasCollision(playerPosX, playerWidth, enemyBB.posX, enemyBB.width, playerPosY, playerHeight, enemyBB.posY, enemyBB.height)) {
				//draw one more frame
				gameManager.draw();
				if (state == "Multiplayer") {
					var roomid = document.getElementById("roomid").innerHTML;
					var cookie = document.cookie.split("=")[1];
					console.log("ROOM ID: " + document.getElementById('roomid').innerHTML);
					console.log("OBJ: " + {roomid : roomid, username : cookie, action : "hit"});
					socket.emit('Player.hit', {roomid : roomid, username : cookie, action : "hit"});
					console.log("SENT HIT");
				}
				gameManager.setState("singlePlayerDeathMenu");

			}
		}
	}

	this.draw = function() {
		enemies.forEach(function(e) {
			e.draw();
		});
	}

	function hasCollision(leftA, widthA, leftB, widthB, topA, heightA, topB, heightB) {
		var halfA = widthA / 2;
		var halfB = widthB / 2;

		var centerA = leftA + halfA;
		var centerB = leftB + halfB;

		var distanceX = centerA - centerB;
		var minDistanceX = halfA + halfB;

		halfA = heightA / 2;
		halfB = heightB / 2;

		centerA = topA + halfA;
		centerB = topB + halfB;

		var distanceY = centerA - centerB;
		var minDistanceY = halfA + halfB;

		return Math.abs(distanceX) < minDistanceX && Math.abs(distanceY) < minDistanceY;
		//return false;
	}
}