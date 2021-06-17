import * as SVG from '@svgdotjs/svg.js';
import {Poly} from './poly.js';
import {Wire} from './wire.js';
import {Term} from './term.js';
import {err, log} from './err.js';
import {Waveform} from './waveform.js';
import {L, H, X} from './sig.js';


// -----------------------------------------------------------------------------
class WireWithLittleNoise {
    constructor() {
        log("inits Wire1");
        let width = 800;
        let height = 100;        
        let ctx = SVG.SVG().addTo("#wire-with-little-noise").size(width, height);
        let w = new Wire(ctx, 10, 50);
        // the following done() and init() methods are awful, try to
        // fit them into the constructor.
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
    }
}

new Mux2(40);

//new Waveform(document.getElementById("wave-id1"), [], {});
// new Waveform(document.getElementById("wave-id1"), [[0, H]], {});

new Waveform(document.getElementById("wave-id1"),
             [[0, H], [10, H], [27, L], [30, H], [33, L], [50, H]],
             50, {});

new Waveform(document.getElementById("wave-id2"),
             [ [0, L],  // start low at time 0.
               [10, L], // L from 0  -> 10
               [12, H], // H from 10 -> 12
               [13, L], // L from 12 -> 13
               [15, H], // H from 13 -> 15 
               [18, L],
               [19, H],
               [22, L],
               [500, H],
             ],
             50, {});





new Waveform(document.getElementById("wave-id-step1"),
             [[0, H], [10, H], [27, L], [30, H], [33, L], [50, H]], 50, {});
new Waveform(document.getElementById("wave-id-step2"),
             [[0, H], [10, H], [27, L], [30, H], [33, L], [50, H]], 50, {});
new Waveform(document.getElementById("wave-id-step3"),
             [[0, H], [10, H], [27, L], [30, H], [33, L], [50, H]], 50, {});
