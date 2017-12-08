var segmentmaker = require('./../management/segment.js');
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
            var segment = new segmentmaker.segment(this.segmentCount, this.SEGMENT_SIZE);
            segment.generate();
            this.segments[this.segmentCount] = segment;
            this.segmentCount++;
            return segment.toObj(this.segmentCount - 1);
        }
        else {
            //return generated segment
            return this.segments[this.segmentCount - 1].serialize(this.segmentCount -1 );
        }
    }
}

exports.board = board;