import {die, log} from './err.js';
import {L, H, X} from './transition.js';
import * as color from './color.js';

export class WaveLine {
    constructor(ctx, sig, h, w, x, y) {        
        this.sig = sig;
        this.arr = [];
        this.h = h;
        // point density. 1 point every PD pixels.
        // the higher this is the lower the density.
        const PD = 3;
        const PIXEL_LEFT = x;
        const PIXEL_RIGHT = x + w;

        var i=0;
        while (1) {
            let px = PIXEL_LEFT + i*PD;
            let py = 20;
            i++;
            if (px > PIXEL_RIGHT) break;
            this.arr.push(px, py);
        }
        
        this.polyline = ctx
            .polyline(this.arr)
            .fill('none')
            .stroke({ width: 2, color: color.SCHEM_BLUE })
            .move(x, 0);
        this.refreshLoop();
    }
    
    refreshLoop() {
        let ps = Object.values(this.polyline.node.points); // points
        let pidx = 0; // point index
        let curTime = 0;
        let numPoints = ps.length;
        let timePerIdx = this.sig.duration / numPoints;

        let f = _=> {
            const POINTS_PER_FRAME = 50; 
            window.requestAnimationFrame(_=> {
                for(var i = 0; i<POINTS_PER_FRAME; i++) {
                    let rval = Math.random();
                    let curVal = this.sig.valueAtTime(curTime);
                    
                    switch(curVal) {
                    case H: 
                        ps[pidx].y = 2 + rval;
                        break;
                    case L: 
                        ps[pidx].y = this.h - 2 + rval;
                        break;
                    case X : 
                        let centerY = this.h/2;
                        let noiseOffset = this.h/10 * rval;
                        ps[pidx].y = centerY + noiseOffset;
                        break;
                    }
                    
                    pidx += 1;
                    curTime += timePerIdx;
                    
                    if (pidx >= ps.length) {
                        pidx = 0;
                        curTime = 0;
                    }
                }
                f();
            });
        }
        f();
    }
}
