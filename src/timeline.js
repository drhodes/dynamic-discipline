import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {SCM_FONT} from './font.js';
import * as color from './color.js';


export class Timeline {
    constructor(div) {
        let ctx = SVG.SVG().addTo(div);
        
        ctx.size(700, 50); // TODO get these sizes from parent.

        this.text = ctx
            .text("")
            .fill(color.SCHEM_BLUE)
            .font({family: SCM_FONT, size: 16 })
            .move(300, 2);
    }
    
    update(t, x) {
        let timeStr = (""+t).slice(0, 6);
        this.text.text(timeStr + "ns");

        // don't let the text exit stage right.
        if (x < 700 - this.text.length()) this.text.move(x, 2);


    }
}
