import {die, log} from './err.js';
import {Poly} from './poly.js';
import {L, H, X} from './transition.js';

// -----------------------------------------------------------------------------

export class Wire {
    constructor(ctx, x, y) {
        this.line = new Poly(ctx, x, y);
        this.noise = null;
        this._rotation = 0;
        this._noiseAmplitude = .1;
    }
    
    move(x, y) {
        this.line.move(x, y);
        return this;
    }
    
    up(px) { this.line.up(px); return this; }
    dn(px) { this.line.dn(px); return this; }
    lt(px) { this.line.lt(px); return this; }
    rt(px) { this.line.rt(px); return this; }

    getPoints() {
        // get the polyline points.
        return this.line.getPoints();
    }

    color(c) {
        this.line.color(c);
    }

    setValue(v) {
        switch (v) {
        case H: this.line.color("red"); break;
        case L: this.line.color("green"); break;
        case X: this.line.color("grey"); break;
        }
    }
    
    check_init() {
        // is this wire initialized?
        // this is awful.
        if (this.noise == null) {
            die("this wire has not been initialized, need to call .init()");
        }
    }
    
    done() {
        this.line.done();
        return this;
    }
    
    init() {
        // this is awful. constructor should take care of this. COME ON!
        if (this.noise) this.noise.remove();
        this.noise = this.line.clone().done();
        return this;
    }

    rotate(deg) {
        this._rotation = deg;
        this.line.rotate(deg);
        this.noise.rotate(deg);
    }
    
    dashed() {
        this.line.dashed();
        return this;
    }
    
    noiseAmplitude(n) {
        this._noiseAmplitude = n;
        return this;
    }

    update() {}
    
    animate() {
        this.check_init();
        
        let f = _=> {
            this.line.update();
            // this allocates every frame, it is slow.  noise could be
            // a class that maintains state, the segment points of the
            // original line.
            
            // this.noise = this.line
            //     .clone()
            //     .subdivide(3)
            //     .width(1)
            //     .randomize(10)
            //     .done()
            //     .color("#777")
            //     .width(1);
            // // design is starting to come unhinged.
            // // noise should be a class that composes Wire.
            // this.noise.rotate(this._rotation);
        };
        
        window.requestAnimationFrame(_=> {
            // this call to remove can go away once Noise is its own class.
            this.noise.remove();
            f();
            this.animate();
        });
    }
}

class WireState {
    constructor(ctx) {        
    }
}

class WireStateH extends WireState{}
class WireStateL extends WireState{}
class WireStateU extends WireState{}
