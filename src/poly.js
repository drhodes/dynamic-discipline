import * as SVG from '@svgdotjs/svg.js';

export class Poly {    
    constructor(ctx, x, y) {
        this.ctx = ctx;
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
        let p = new Poly(this.ctx, this.x, this.y);
        p.segments = [...this.segments];
        return p;
    }

    remove() { this.polyline.remove(); }

    rotate(deg) {
        this.polyline.transform({rotate: deg});
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
        for (var i=0; i<n; i++) this.subdivideSegmentsOnce();
        return this.done();
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
    lt(px) { return this.push(-px, 0); }
    rt(px) { return this.push(+px, 0); }
    to(dx, dy) { return this.push(dx, dy); }
    
    done() {
        if (this.polyline) this.polyline.remove();
        this.polyline = this.ctx
            .polyline(this.segments)
            .fill('none')
            .stroke({ width: 2, color:'blue'});
        return this;
    }

    dashed() {
        this.polyline.stroke({ dasharray: "3,3"});
        return this;
    }

    color(c) {
        this.polyline.stroke({ color: c });
        return this;
    }
    black() { return this.color('black'); }
    width(w) {
        this.polyline.stroke({ width:w });
        return this;
    }

    undashed() {
        this.polyline.stroke({ dasharray: "0,0"});
        return this;
    }

    randomize(amplitude) {
        for (var i=0; i<this.segments.length; i++) {
            let delta = Math.random() * amplitude - (amplitude/2);
            this.segments[i] += delta;
        }
        return this;
    }

    // rename this function: stepDashAnimation
    update() {
        this.dashoffset -= .2;
        this.polyline.stroke({ dashoffset: this.dashoffset});
    }
}

