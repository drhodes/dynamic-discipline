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
    }

    insertIframe() {
        //const div = document.select
    }
}

new App();
