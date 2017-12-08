var segmentmaker = require('./segment.js');

//Describes a board that the players interact on
function board(SEGMENT_SIZE) {
    this.segments = [];
    this.segmentCount = 0;
    this.SEGMENT_SIZE = SEGMENT_SIZE;
    //calling getSegment with a distance above
    this.getSegment = function(distance) {
        if (distance >= (this.segmentCount * this.SEGMENT_SIZE - (this.SEGMENT_SIZE / 2))) {
            //generate new segment and return it
            //client should already have 
            console.log("Generating a new segment");
            var segment = segmentmaker.segment(segmentCount, SEGMENT_SIZE);
            segment.generate();
            this.segments[this.segmentCount] = segment;
            segmentCount++;
            return segment.serialize(this.segmentCount - 1);
        }
        else {
            //return generated segment
            console.log("PRE RETURN BOARD: ");
            console.log(this.segments[this.segmentCount - 1].serialize(this.segmentCount -1));
            console.log("POST RETURN BOARD.");
            return this.segments[this.segmentCount - 1].serialize(this.segmentCount -1 );
        }
    }
}

exports.board = board;