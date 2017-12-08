//Describes a chunk of the board
function segment(id, size) {
    this.id = 0;
    this.size = 0;
    this.chunks = null;
    this.hasGenerated = false;
    this.minTime = 0;
    this.randInterval = 0;

    this.init = function(id, size) {
        this.id = id;
        this.size = size;
        this.chunks = new Array(size);
        this.hasGenerated = false;
        this.minTime = 1000;
        this.randInterval = 1000;
    }
    //Handles the actual enemy generation
    //A simple modification of Kyle's enemyManger.spawnEnemy()
    this.randomEnemy = function(){
        var rand = Math.random();
        if(rand > 0.5) {
            return "floor";
        }
        else {
            return "ariel";
        }
    }
    //spawns an array of enemies of size size
    this.generate = function() {
        for (var i = 0; i < this.size; i++) {
            this.chunks[i] = this.randomEnemy();
        }
        this.hasGenerated = true;
    }
    //Based off of enemyManager.spawnEnemy()
    this.randomTime = function() {
        return (this.minTime + Math.random() * this.randInterval);
    }
    //Returns [ {"id" : int, "enemy" : string}]
    //segmentPosition is where the segment is in relation to the board
    // Ex: seg: 0, ids start at 0, seg: 1, ids start at 100
    this.toObj = function(segmentPosition) {
        var start = segmentPosition * (this.size + 1);
        var arr = new Array(this.size);
        for (var i = 0; i < this.size; i++) {
            var obj = {
                id : (start + i),
                enemy : this.chunks[i],
                spawnTime : this.randomTime()
            };
            arr[i] = obj;
        }
    }
    //Returns a serialized version of toObj
    this.serialize = function(segmentPosition) {
        return JSON.stringify(this.toObj(segmentPosition));
    }
}

exports.segment = segment;