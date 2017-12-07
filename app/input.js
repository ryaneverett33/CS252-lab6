var Input = (function() {
	var instance;

	function SingletonClass() {
		var heldKeys = [];
		var pressedKeys = [];
		var validPress = [];

		this.init = function(canvas) {
			for(var i = 0; i < 254; i++)
				validPress.push(true);

			canvas.addEventListener("keydown", onKeyDown);
			canvas.addEventListener("keyup", onKeyUp);
		}

		function onKeyDown(event) {
			heldKeys[event.keyCode] = true;

			if(validPress[event.keyCode]) {
				pressedKeys[event.keyCode] = true;
				validPress[event.keyCode] = false;
			}
		}

		function onKeyUp(event) {
			heldKeys[event.keyCode] = false;
			pressedKeys[event.keyCode] = false;
			validPress[event.keyCode] = true;
		}

		this.isKeyHeld = function(keyCode) {
			return heldKeys[keyCode];
		}

		this.isKeyPressed = function(keyCode) {
			return pressedKeys[keyCode];
		}

		this.clear = function() {
			pressedKeys = [];
		}
	}

	return {
		getInstance: function() {
			if(instance == null) {
				instance = new SingletonClass();
				instance.constructor = null;
			}

			return instance;
		}
	};
})();