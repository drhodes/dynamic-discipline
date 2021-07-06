import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Attributes} from './attrs.js';
import {WaveGroup} from './wavegroup.js';
import {Schematic} from './schem.js';
import {Timeline} from './timeline.js';

// need to add a time ruler.

export class LabBench {
    constructor(div) {
        if (!div) die("LabBench constructor got a bad div: " + div);
        this.div = div;
        this.schematic = null;
        this.wavegroup = null;
        this.timeline = null;
        
        Object.values(div.children).forEach( el => {             
            let atts = new Attributes(el);
            if (atts.hasClass("schem")) {
                this.schematic = new Schematic(el, this);
            }
            if (atts.hasClass("wavegroup")) {
                this.wavegroup = new WaveGroup(el, this);
            } 
            if (atts.hasClass("timeline")) {
                this.timeline = new Timeline(el, this);
            }
           
        });

        if (this.schematic == null) die ("schematic div not found in DOM");
        if (this.wavegroup == null) die ("wavegroup div not found in DOM");
        if (this.wavegroup == null) die ("timeline div not found in DOM");
    }

    update(wavegroup) {
        let sigmap = wavegroup.getSignalMap();
        let t = wavegroup.getCurTime();
        let x = wavegroup.waveforms[0].pxFromTime(t);
        this.timeline.update(t, x);
        this.schematic.update(sigmap);
    }

    specialSigfunc(signame, f) {
        this.wavegroup.getWaveform(signame).setSpecialSigFunc(f);
    }
}
