import {die, log} from './err.js';
import {Poly} from './poly.js';

// -----------------------------------------------------------------------------

export class Wire {
    constructor(ctx, x, y) {
        this.line = new Poly(ctx, x, y);
        this.noise = null;
        this._rotation = 0;
        this._noiseAmplitude = .1;
    }
    up(px) { this.line.up(px); return this; }
    dn(px) { this.line.dn(px); return this; }
    lt(px) { this.line.lt(px); return this; }
    rt(px) { this.line.rt(px); return this; }

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
    }
    
    dashed() {
        this.line.dashed();
        return this;
    }
    
    noiseAmplitude(n) {
        this._noiseAmplitude = n;
        return this;
    }
    
    animate() {
        this.check_init();
        
        let f = _=> {
            this.line.update();
            this.noise = this.line
                .clone()
                .subdivide(3)
                .width(1)
                .randomize(10)
                .done().color("#777").width(1);
            // this is starting to come unhinged.
            this.noise.rotate(this._rotation);
        };
        
        window.requestAnimationFrame(_=> {
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
