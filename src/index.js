//import src/svg
import * as SVG from '@svgdotjs/svg.js';

// Learn more about the mode configuration here and what optimizations take place on each value.

function log(msg) {
    console.log("dyndisc> " + msg);
}

// -----------------------------------------------------------------------------
class Segment {
    constructor(p1, p2) {
        // connect two points with a conducting element        
        // currently this is an SVG line
    }
    setP1(p) { this.p1 = p; }
    setP2(p) { this.p2 = p; }
}

// -----------------------------------------------------------------------------
class WireState {
    constructor() {        
    }
}

class WireStateH extends WireState{}
class WireStateL extends WireState{}
class WireStateU extends WireState{}
      
class Wire {
    // the wire on the schematic.
    constructor(points) {        
        this.segments = [];
        // window over points connected each segment
    }
}


class ValueWire extends Wire {
    constructor() {
        
        //
    }
}

// -----------------------------------------------------------------------------
class App {
    constructor() {
        log("initing App");
        var ctx = SVG.SVG();
        ctx.addTo("#dynamic-discipline");
        ctx.size(800, 600);
        console.log(ctx);
        console.log(new SVG.Point(1,2));
    }

    insertIframe() {
        //const div = document.select
    }
}

new App();
