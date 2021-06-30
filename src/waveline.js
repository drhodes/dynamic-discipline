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
        const PD = 5;
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
        ;
        this.polyline.move(x, 0);
        this.refreshLoop();
    }
    
    refreshLoop() {
        let ps = Object.values(this.polyline.node.points);
        let pidx = 0;
        let curTime = 0;
        let numPoints = ps.length;
        let timePerIdx = this.sig.duration / numPoints;
        
        let f = _=> {
            window.requestAnimationFrame(_=> {
                for(var i = 0; i<20; i++) {
                    let rval = Math.random();
                    let curVal = this.sig.valueAtTime(curTime);
                    
                    if (curVal == H) {
                        ps[pidx].y = 2 + rval;
                    } else if (curVal == L) {
                        ps[pidx].y = this.h - 2 + rval;
                    } else if (curVal == X) {
                        let centerY = this.h/2;
                        let noiseOffset = this.h/5 * rval;
                        ps[pidx].y = centerY + noiseOffset;
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
