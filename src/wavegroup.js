import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Attributes} from './attrs.js';
import {Waveform} from './waveform.js';

// need to add a time ruler.

export class WaveGroup {
    constructor(div, parent) {
        this.div = div;
        this.parent = parent;
        let attrs = new Attributes(div);
        let w = attrs.getAsNum("w");
        let h = attrs.getAsNum("h");
        let dur = attrs.getAsNum("duration");

        
        // iterate over items in div.
        // construct waveforms as they encountered.

        this.waveforms = []; // map from waveform name to waveform

        div.children.forEach( el => {            
            let atts = new Attributes(el);
            // check that element (el) is a waveform.
            if (atts.hasAttr("class") && atts.get("class").indexOf("waveform") != -1) {

                /* passing "this" to the waveform constructor is the
                   way to spagetti, the beginning of the end, but it
                   does allow for two way communication.  Another
                   alternative would be to use a shared queue.  */
                
                this.waveforms.push(new Waveform(el, this, w, h, dur ));
            }
        });

    }
    
    updateTimeLines(x) {
        this.waveforms.forEach( wf => {
            wf.updateTimeLine(x);
        });
    }

    updateBench() {
        //
        // two-way data binding. :/
        //
        this.parent.update(this);
    }

    getSignalMap() {
        let sigmap = {};
        this.waveforms.forEach(wf => {
            sigmap[wf.name] = wf.getCurValue();
        });        
        return sigmap;
    }
}
