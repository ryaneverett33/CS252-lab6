function EnemyManager(floorPosY, canvasWidth) {
	this.enemies = [];

	this.spawnFloorEnemy = function() {
		var e = new Enemy(floorPosY, canvasWidth, "floor");
		this.enemies.push(e);
	}

	this.spawnArielEnemy = function() {
		var e = new Enemy(floorPosY, canvasWidth, "ariel");
		this.enemies.push(e);
	}

	this.update = function(playerPosX, playerPosY, playerWidth, playerHeight) {
		//must start from the end to avoid issues with removing enemy mid-iteration
		for(var i = this.enemies.length - 1; i >= 0; i--) {
			var e = this.enemies[i];

			if(e.posX + e.width < 0) {
				this.enemies.splice(i, 1);
				continue;
			}

			e.update();

			if(hasCollision(playerPosX, playerWidth, e.posX, e.width, playerPosY, playerHeight, e.posY, e.height)) {
				//draw one more frame
				gameManager.draw();

				gameManager.setState("singlePlayerDeathMenu");

			}
		}
	}

	this.draw = function() {
		this.enemies.forEach(function(e) {
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
	}
}