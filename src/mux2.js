import * as SVG from '@svgdotjs/svg.js';
import {Poly} from './poly.js';
import {Wire} from './wire.js';
import {Term} from './term.js';
import {err, log} from './err.js';
import {Waveform} from './waveform.js';
import {Attributes} from './attrs.js';
import {L, H, X} from './sig.js';


export class Mux2 {
    constructor(div, scale) {
        log("inits Mux2");
        let width = 700;
        let height = 200;        
        let ctx = SVG.SVG()
            .addTo("#mux-2")
            .size(width, height);
        
        // <div id="mux-2" sel="S" in0="D0" in1="D1" out="Q"></div>
        let attrs = new Attributes(div);
        
        const S=scale;
        
        var o = this.origin = {top:height/100 , left:width/2};
        let icon = new Poly(ctx, o.left, o.top)
            .to(S, S*.75)
            .dn(2.5*S)
            .to(-S, S*.75)
            .up(4*S)
            .done()
            .width(3);

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
            in0: new Term(ctx, S, attrs.get("in0"), o.left-(1*S), o.top+(1*S)),
            in1: new Term(ctx, S, attrs.get("in1"), o.left-(1*S), o.top+(3*S)),
            sel: new Term(ctx, S, attrs.get("sel"), o.left+(0), o.top+(4.1*S)),
            out: new Term(ctx, S, attrs.get("out"), o.left+(1*S), o.top+(2*S)),
        };        
        this.terminals["sel"].rotate(-90);
        
    }

    nudgeLabel(termName, dx, dy) {
        // allow users adjust terminal label positions.
        this.terminals[termName].nudgeLabel(dx, dy);
    }
}
