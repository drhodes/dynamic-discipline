import * as SVG from '@svgdotjs/svg.js';
import {Poly} from './poly.js';
import {Wire} from './wire.js';
import {Term} from './term.js';
import {die, log} from './err.js';
import {Waveform} from './waveform.js';
import {Attributes} from './attrs.js';
import {L, H, X} from './sig.js';
import * as color from './color.js';
import {SCM_FONT} from './font.js';
import {Device} from './device.js';

export class Mux2 extends Device {
    constructor(ctx, div, scale, x, y) {
        var o = {top:y , left:x};
        let width = ctx.width();
        let height = ctx.height();
        const S=scale;

        let attrs = new Attributes(div);
        let terminals = {
            in0: new Term(ctx, S, attrs.get("in0"), o.left-(1*S), o.top+(1*S)),
            in1: new Term(ctx, S, attrs.get("in1"), o.left-(1*S), o.top+(3*S)),
            sel: new Term(ctx, S, attrs.get("sel"), o.left+(0), o.top+(4.1*S)),
            out: new Term(ctx, S, attrs.get("out"), o.left+(1*S), o.top+(2*S)),
        };
        
        super(terminals, attrs);
        // Draw! ------------------------------------------------------------------
        
        let icon = new Poly(ctx, o.left, o.top)
            .to(S, S*.75)
            .dn(2.5*S)
            .to(-S, S*.75)
            .up(4*S)
            .done()
            .color(color.SCHEM_BLUE)
            .width(1);
        
        const SIDE_NUDGE = S*.3;
        const VERT_NUDGE_ZERO = S*.7;        
        ctx.text("0")
            .fill(color.SCHEM_BLUE)
            .font({family: SCM_FONT, size:16})
            .move(o.left + SIDE_NUDGE,
                  o.top + VERT_NUDGE_ZERO);
        
        const VERT_NUDGE_ONE = S*2.7;
        ctx.text("1")
            .fill(color.SCHEM_BLUE)
            .font({family: SCM_FONT, size:16})
            .move(o.left + SIDE_NUDGE, o.top + VERT_NUDGE_ONE);
        
        terminals["sel"].rotate(-90);
    }

    // this should be a method an interface called Device.
    // getConnectionPx(termName) {
    //     // get the absolute pixel position of a terminal give a
    //     // terminal name
    //     let term = this.terminals[termName];
    //     let ps = term.getPoints();
    //     if (term) {
    //         if (termName == "out") {
    //             return ps[1];
    //         }
    //         die("need to handle other terminal names");
    //     } else {
    //         die("Could not find terminal: " + termName);
    //     }
    // }
}
