import * as SVG from '@svgdotjs/svg.js';
import {Poly} from './poly.js';
import {Wire} from './wire.js';
import {Term} from './term.js';
import {err, log} from './err.js';
import {Waveform} from './waveform.js';

// -----------------------------------------------------------------------------
class WireWithLittleNoise {
    constructor() {
        log("inits Wire1");
        let width = 800;
        let height = 100;        
        let ctx = SVG.SVG().addTo("#wire-with-little-noise").size(width, height);
        let w = new Wire(ctx, 10, 50);
        // the following done() and init() methods are awful.
        w = w.rt(700).done().init().dashed();        
        w.animate();
    }
}

// uncomment this line.
// new WireWithLittleNoise();

class Mux2 {
    constructor(scale) {
        log("inits Mux2");
        let width = 700;
        let height = 300;        
        let ctx = SVG.SVG().addTo("#mux-2").size(width, height);

        const S=scale;
        
        var o = this.origin = {top:height/8 , left:width/2};
        let icon = new Poly(ctx, o.left, o.top)
            .to(S, S)
            .dn(2*S)
            .to(-S,S)
            .up(4*S)
            .done();

        // 
        const SIDE_NUDGE = S*.35;
        const VERT_NUDGE_ONE = S*.8;
        ctx.text("1")
            .fill("blue")
            .font({family: 'Courier'})
            .move(o.left + SIDE_NUDGE,
                  o.top + VERT_NUDGE_ONE);

        const VERT_NUDGE_ZERO = S*2.8;
        ctx.text("0")
            .fill("blue")
            .font({family: 'Courier'})
            .move(o.left + SIDE_NUDGE, o.top + VERT_NUDGE_ZERO);

        
        // allocate terminals.
        let inputQ  = new Term(ctx, S, "Q'", o.left-(1*S), o.top+(1*S));
        let inputD  = new Term(ctx, S, 'D', o.left-(1*S), o.top+(3*S)); 
        let inputG  = new Term(ctx, S, 'G', o.left+(0), o.top+(4*S));
        inputG.rotate(-90);
        let outputQ = new Term(ctx, S, 'Q', o.left+(1*S), o.top+(2*S));

        // adjust terminal label positions.
        outputQ.nudgeLabel(1.1, .14);
        inputD.nudgeLabel(-.5, -.19);
        inputQ.nudgeLabel(-.5, -.19);
        inputG.nudgeLabel(.4, .7);


        
        // let feedbackWire = new Wire( ctx, o.left+U + outputQ.leadLength(), o.top+(2*U));
        // // the following done() and init() methods are awful.
        // feedbackWire.rt(3*U/2).up(3*U).lt(9*U/2).dn(2*U).done().init().dashed();
        // feedbackWire.animate();
    }
}

new Mux2(40);

console.log(document.getElementById("wave-id1"));
new Waveform(document.getElementById("wave-id1"),{} );
