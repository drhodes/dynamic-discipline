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

export class And2 extends Device {
    constructor(ctx, div, scale, x, y) {
        log("inits And2");
        var o = {top:y , left:x};
        let width = ctx.width();
        let height = ctx.height();
        const S=scale;

        let attrs = new Attributes(div);
        let terminals = {
            in0: new Term(ctx, S, attrs.get("in0"), o.left-(1*S), o.top+(.3*S)),
            in1: new Term(ctx, S, attrs.get("in1"), o.left-(1*S), o.top+(1.1*S)),
            out: new Term(ctx, S, attrs.get("out"), o.left+(1.6*S), o.top+(.7*S)),
        };
        super(terminals, attrs);

        // drawn in inkscape! -------------------------------------------------------
        let pathString = "m 62.177083,117.08333 h 33.072916 c 17.197921,1.32292 26.458331,11.90626 31.750001,27.78125 -5.29167,15.87499 -14.55208,26.45833 -31.750003,27.78125 H 62.177083 Z";

        var path = ctx.path(pathString);
        path.fill('none').move(x, y);
        path.stroke({ color: color.SCHEM_BLUE, width: 1, linecap: 'round', linejoin: 'round' });
    }
    
    // this should be a method an interface called Device.
    getConnectionPx(termName) { die("unimplemented"); }
}
