import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {SCM_FONT} from './font.js';
import * as color from './color.js';


export class Timeline {
    constructor(div) {
        let ctx = SVG.SVG().addTo(div);
        ctx.size(700, 50);

        this.text = ctx
            .text("")
            .fill(color.SCHEM_BLUE)
            .font({family: SCM_FONT, size: 20 })
            .move(300, 20);

        
    }
    update(t) {
        let timeStr = (""+t).slice(0, 6);
        this.text.text(timeStr + "ns");
    }
}
