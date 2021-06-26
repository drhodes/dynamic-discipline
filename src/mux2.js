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
        
        // allocate terminals.
        this.terminals = {
            in0: new Term(ctx, S, attrs.get("in0"), o.left-(1*S), o.top+(1*S)),
            in1: new Term(ctx, S, attrs.get("in1"), o.left-(1*S), o.top+(3*S)),
            sel: new Term(ctx, S, attrs.get("sel"), o.left+(0), o.top+(4.1*S)),
            out: new Term(ctx, S, attrs.get("out"), o.left+(1*S), o.top+(2*S)),
        };
        
        this.userTermNames = [];
        ["in0", "in1", "sel", "out"].forEach(termName => {
            this.userTermNames[attrs.get(termName)] = this.terminals[termName];
            console.log([termName, this.userTermNames[attrs.get(termName)]]);
            console.log(this.userTermNames);
        });
        
        this.terminals["sel"].rotate(-90);
    }

    termFromUserDefName(userDefName) {
        // need to keep a mapping from user defined name to terminal keys.
        return this.userTermNames[userDefName];
    }
    
    nudgeLabel(userDefName, dx, dy) {
        console.log("AM NUDGING!");
        // allow users adjust terminal label positions.
        // this.terminals[termName]
        this.termFromUserDefName(userDefName).nudgeLabel(dx, dy);
    }

    // this should be a method an interface called Device.
    getConnectionPx(termName) {
        // get the absolute pixel position of a terminal give a
        // terminal name
        let term = this.terminals[termName];
        let ps = term.getPoints();
        if (term) {
            if (termName == "out") {
                return ps[1];
            }
            die("need to handle other terminal names");
        } else {
            die("Could not find terminal: " + termName);
        }
    }

    update(sigmap) {        
        for (let term of Object.values(this.terminals)) {            
            let val = sigmap[term.name];
            if (val && val.ok) {
                term.updateValue(val.val);
            }
        }
    }
}
