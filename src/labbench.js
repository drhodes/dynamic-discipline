import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Attributes} from './attrs.js';
import {WaveGroup} from './wavegroup.js';
import {Schematic} from './schem.js';
import {Chan} from './chan.js';

// need to add a time ruler.

export class LabBench {
    constructor(div) {
        if (!div) die("LabBench constructor got a bad div: " + div);
        console.log(div)
        this.div = div;
        this.schematic = null;
        this.wavegroup = null;

        //
        div.children.forEach( el => {             
            console.log(this);
            let atts = new Attributes(el);
            if (atts.hasClass("schem")) {
                this.schematic = new Schematic(el, this);
            }
            if (atts.hasClass("wavegroup")) {
                this.wavegroup = new WaveGroup(el, this);
            }
        });

        if (this.schematic == null) die ("schematic div not found in DOM");
        if (this.wavegroup == null) die ("wavegroup div not found in DOM");
    }

    update(wavegroup) {
        let sigmap = wavegroup.getSignalMap();        
        this.schematic.update(sigmap);
        // this.wavegroup.update(); TODO make this more consistent.
    }
}
