function EnemyManager(floorPosY, canvasWidth) {
	var enemies = [];

	this.spawnEnemy = function() {
		var e = new Enemy(floorPosY, canvasWidth);

		enemies.push(e);
	}

	this.update = function() {
		enemies.forEach(function(e) {
			e.update();
		});
	}

	this.draw = function(canvas) {
		enemies.forEach(function(e) {
			e.draw(canvas);
		});
	}
}