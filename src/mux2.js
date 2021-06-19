import * as SVG from '@svgdotjs/svg.js';
import {Poly} from './poly.js';
import {Wire} from './wire.js';
import {Term} from './term.js';
import {err, log} from './err.js';
import {Waveform} from './waveform.js';
import {L, H, X} from './sig.js';


export class Mux2 {
    constructor(scale) {
        log("inits Mux2");
        let width = 700;
        let height = 300;        
        let ctx = SVG.SVG().addTo("#mux-2").size(width, height);

        const S=scale;
        
        var o = this.origin = {top:height/8 , left:width/2};
        let icon = new Poly(ctx, o.left, o.top)
            .to(S, S*.75)
            .dn(2.5*S)
            .to(-S, S*.75)
            .up(4*S)
            .done();

        // 
        const SIDE_NUDGE = S*.35;
        const VERT_NUDGE_ONE = S*.8;
        ctx.text("0")
            .fill("blue")
            .font({family: 'Courier'})
            .move(o.left + SIDE_NUDGE,
                  o.top + VERT_NUDGE_ONE);

        const VERT_NUDGE_ZERO = S*2.8;
        ctx.text("1")
            .fill("blue")
            .font({family: 'Courier'})
            .move(o.left + SIDE_NUDGE, o.top + VERT_NUDGE_ZERO);

        // allocate terminals.
        this.terminals = {
            inputQ: new Term(ctx, S, "Q'", o.left-(1*S), o.top+(1*S)),
            inputD: new Term(ctx, S, 'D', o.left-(1*S), o.top+(3*S)),
            inputG:  new Term(ctx, S, 'G', o.left+(0), o.top+(4.1*S)),
            outputQ: new Term(ctx, S, 'Q', o.left+(1*S), o.top+(2*S)),
        };
        this.terminals["inputG"].rotate(-90);
        
    }

    nudgeLabel(termName, dx, dy) {
        // allow users adjust terminal label positions.
        this.terminals[termName].nudgeLabel(dx, dy);
    }
}
