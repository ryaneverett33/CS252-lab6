function EnemyManager(floorPosY, canvasWidth) {
	var enemies = [];

	this.spawnEnemy = function() {
		var e = new Enemy(floorPosY, canvasWidth);

		enemies.push(e);
	}

	this.update = function() {
		//must start from the end to avoid issues with removing enemy mid-iteration
		for(var i = enemies.length - 1; i >= 0; i--) {
			if(enemies[i].centerX < 0 - enemies[i].radius) {
				enemies.splice(i, 1);
				continue;
			}

			enemies[i].update();
		}
	}

	this.draw = function(canvas) {
		enemies.forEach(function(e) {
			e.draw(canvas);
		});
	}
}