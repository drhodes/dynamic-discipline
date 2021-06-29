import {die, log} from './err.js';

export class WaveLine {
    constructor(ctx, sig, h, w, x, y) {        
        this.sig = sig;
        this.arr = [];
        this.h = h;
        // point density. 1 point every PD pixels.
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
            .stroke({ width: 2, color: "grey" })
        ;
        this.polyline.move(x, 0);
        this.refreshLoop();
    }

    // setDigitalValue(val) {
    // }
    
    refreshLoop() {
        let ps = Object.values(this.polyline.node.points);
        let pidx = 0;
        let curTime = 0;
        let numPoints = ps.length / 2;
        let timePerIdx = this.sig.duration / numPoints;
        
        console.log(this.sig);
        
        let f = _=> {
            window.requestAnimationFrame(_=> {
                for(var i = 0; i<20; i++) {
                    let rval = Math.random();
                    let curVal = this.sig.valueAtTime(curTime);
                    // console.log([curTime, curVal]);
                    if (curVal.val == 1) {
                        ps[pidx].y = 2 + rval;
                    } else {
                        ps[pidx].y = this.h - 2 + rval;
                    }
                    pidx += 1;
                    curTime += timePerIdx/2;
                    
                    if (pidx >= ps.length) {
                        pidx = 0; // reset points index
                        curTime = 0; // reset time index
                    }
                }
                f();
            });
        }
        f();
    }
}
