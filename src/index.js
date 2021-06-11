import * as SVG from '@svgdotjs/svg.js';

function log(msg) { console.log("dyndisc> " + msg); }

// -----------------------------------------------------------------------------
class WireState {
    constructor(ctx) {        
    }
}

class WireStateH extends WireState{}
class WireStateL extends WireState{}
class WireStateU extends WireState{}

class Poly {    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.segments = [x, y];
        this.dashoffset = 0;
        this._dashspeed = .1;
        this.polyline = null; // make sure to throw error if this is
                              // attempted to be drawn without proper
                              // initialization.
    }

    clone() {
        // important: this method does not clone the SVG element.
        let p = new Poly(this.x, this.y);
        p.segments = [...this.segments];
        return p;
    }

    remove() {
        this.polyline.remove();
    }
    
    dashspeed(n) {
        this._dashspeed = n;
        return this;
    }
    
    subdivideSegmentsOnce() {
        // this does not touch the SVG polyline.
        let segs = [];
        for (var i=0; i<this.segments.length-2; i += 2) {
            const x1 = this.segments[i+0];
            const y1 = this.segments[i+1];
            const x2 = this.segments[i+2];
            const y2 = this.segments[i+3];
            const x = (x1+x2)/2;
            const y = (y1+y2)/2;
            segs.push(x1, y1, x, y);

            // if we're at the last segment then push the last point on.
            if (i == this.segments.length-4) segs.push(x2, y2); 
        }
        this.segments = segs;
    }
    
    subdivide(n) {
        // subdivide the polyline n times.
        for (var i=0; i<n; i++) {
            this.subdivideSegmentsOnce();
        }
        this.done();
        return this;
    }
    
    // these methods are for building up the line segments.
    push(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.segments.push(this.x, this.y);
        this.dashoffset = 0;
        return this;
    };
    
    up(px) { return this.push(0, -px); }
    dn(px) { return this.push(0, +px); }
    rt(px) { return this.push(+px, 0); }
    lt(px) { return this.push(-px, 0); }
    
    done() {
        if (this.polyline) this.polyline.remove();
        this.polyline = App.ctx
            .polyline(this.segments)
            .fill('none')
            .stroke({ width: 2, color:'green', dasharray: "10,5" });
        return this;
    }

    randomize(amplitude) {
        for (var i=0; i<this.segments.length; i++) {
            let delta = Math.random() * amplitude - (amplitude/2);
            this.segments[i] += delta;
        }
        return this;
    }
    
    update() {
        this.dashoffset += .2;
        this.polyline.stroke({ dashoffset: this.dashoffset});
    }
}

// class ValueWire extends Wire {
//     constructor() {
//         super(Wire);
//     }
//     //    
// }

// -----------------------------------------------------------------------------
class App {
    static ctx = SVG.SVG();
    static scale = 50;
    constructor() {
        log("initing App");
        App.ctx.addTo("#dynamic-discipline");
        App.ctx.size(800, 100);
        
        let poly = new Poly(10, 50);
        poly.rt(700).done();
        let p2 = poly.clone().subdivide(5).dashspeed(10).randomize(4).done();
        
        function foof() {
            p2.remove();
            poly.update();
            p2 = poly.clone().subdivide(5).randomize(8).done();
            window.requestAnimationFrame(foof);
        }
        foof();
    }

    update() { }
}

new App();


// class Div {
//     static ctx = SVG.SVG();
//     static scale = 50;
//     constructor(w, h, divname) {
//         log("initing Div");
//         App.ctx.addTo("#wire1");
//         App.ctx.size(w, h);
        
//         let poly = new Poly(50, 50);
//         poly.up(50).rt(50).dn(50).lt(50).done();
//         let p2 = poly.clone().subdivide(5).dashspeed(10).randomize(4).done();
        
//         function foof() {
//             p2.remove();
//             poly.update();
//             p2 = poly.clone().subdivide(5).randomize(8).done();
//             window.requestAnimationFrame(foof);
//         }
//         foof();
//     }

//     update() { }
// }


// new Div(400, 100, "#wire1");

