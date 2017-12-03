function EnemyManager(floorPosY, canvasWidth) {
	var that = this;
	var enemies = [];
	var ret;

	var initSpeed = 5;
	this.speed = this.initSpeed;

	var initMinTime = 1000;
	this.minTime = this.initMinTime;

	this.randInterval = 1000;

	this.init = function() {
		enemies.length = 0;
		clearInterval(ret);
		ret = setInterval(that.spawnEnemy, 1000);
		this.speed = initSpeed;
		this.minTime = initMinTime;
	}

	this.spawnEnemy = function() {
		var rand = Math.random();

		if(rand > 0.5) {
			var e = new Enemy(floorPosY, canvasWidth, "floor");
			enemies.push(e);
		}
		else {
			var e = new Enemy(floorPosY, canvasWidth, "ariel");
			enemies.push(e);
		}

		clearInterval(ret);
		ret = setInterval(that.spawnEnemy, that.minTime + Math.random() * that.randInterval);
	}

	this.update = function(playerPosX, playerPosY, playerWidth, playerHeight) {
		//must start from the end to avoid issues with removing enemy mid-iteration
		for(var i = enemies.length - 1; i >= 0; i--) {
			var e = enemies[i];

			if(e.posX + e.width < 0) {
				enemies.splice(i, 1);
				continue;
			}

			e.update(that.speed);

			if(hasCollision(playerPosX, playerWidth, e.posX, e.width, playerPosY, playerHeight, e.posY, e.height)) {
				//draw one more frame
				gameManager.draw();

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