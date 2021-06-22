import * as SVG from '@svgdotjs/svg.js';
import {Poly} from './poly.js';
import {Wire} from './wire.js';
import {Term} from './term.js';
import {die, log} from './err.js';
import {Waveform} from './waveform.js';
import {Attributes} from './attrs.js';
import {L, H, X} from './sig.js';


export class Mux2 {
    constructor(ctx, div, scale, x, y) {
        log("inits Mux2");
        let width = ctx.width();
        let height = ctx.height();
        
        // <div id="mux-2" sel="S" in0="D0" in1="D1" out="Q"></div>
        let attrs = new Attributes(div);
        const S=scale;
        
        var o = this.origin = {top:y , left:x};
        let icon = new Poly(ctx, o.left, o.top)
            .to(S, S*.75)
            .dn(2.5*S)
            .to(-S, S*.75)
            .up(4*S)
            .done()
            .width(3);

        // 
        const SIDE_NUDGE = S*.34;
        const VERT_NUDGE_ZERO = S*.7;
        ctx.text("0")
            .fill("blue")
            .font({family: 'Courier'})
            .move(o.left + SIDE_NUDGE,
                  o.top + VERT_NUDGE_ZERO);
        
        const VERT_NUDGE_ONE = S*2.7;
        ctx.text("1")
            .fill("blue")
            .font({family: 'Courier'})
            .move(o.left + SIDE_NUDGE, o.top + VERT_NUDGE_ONE);

        // allocate terminals.
        this.terminals = {
            in0: new Term(ctx, S, attrs.get("in0"), o.left-(1*S), o.top+(1*S)),
            in1: new Term(ctx, S, attrs.get("in1"), o.left-(1*S), o.top+(3*S)),
            sel: new Term(ctx, S, attrs.get("sel"), o.left+(0), o.top+(4.1*S)),
            out: new Term(ctx, S, attrs.get("out"), o.left+(1*S), o.top+(2*S)),
        };
        
        this.terminals["sel"].rotate(-90);        
        this.nudgeLabel("out", .1 , .1);
        this.nudgeLabel("in1", -.55, .1);
        this.nudgeLabel("in0", -.55, .1);
        this.nudgeLabel("sel", 0, .45);
    }

    nudgeLabel(termName, dx, dy) {
        // allow users adjust terminal label positions.
        this.terminals[termName].nudgeLabel(dx, dy);
    }

    getConnectionPx(termName) {
        // get the absolute pixel position of a terminal give a
        // terminal name
        let term = this.terminals[termName];
        let ps = term.getPoints();
        if (term) {
            if (termName == "out") {
                return ps[1];
            }
        } else {
            die("Could not find terminal: " + termName);
        }
        
    }
}
