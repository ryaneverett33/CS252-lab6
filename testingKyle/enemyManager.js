function EnemyManager(floorPosY, canvasWidth) {
	var enemies = [];

	this.spawnFloorEnemy = function() {
		var e = new Enemy(floorPosY, canvasWidth, "floor");
		enemies.push(e);
	}

	this.spawnArielEnemy = function() {
		var e = new Enemy(floorPosY, canvasWidth, "ariel");
		enemies.push(e);
	}

	this.update = function() {
		//must start from the end to avoid issues with removing enemy mid-iteration
		for(var i = enemies.length - 1; i >= 0; i--) {
			if(enemies[i].posX + enemies[i].width < 0) {

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