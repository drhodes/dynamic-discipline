import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Attributes} from './attrs.js';
import {Waveform} from './waveform.js';


export class WaveGroup {
    constructor(div) {
        let attrs = new Attributes(div);
        let waveformW = attrs.getAsNum("w");
        let waveformH = attrs.getAsNum("h");
        let waveformDuration = attrs.getAsNum("duration");
        
        // iterate over items in div.
        // construct waveforms as they encountered.
        
        // ensure this div has type "wavegroup"
        
        // this.ctx = SVG.SVG().addTo(elementId).size(this.widthPx, this.heightPx);
        this.waveforms = {}; // map from waveform name to waveform

        div.children.forEach( el => {            
            let attrs = new Attributes(el);

            // check if this element (el) is a waveform.
            if (attrs.get("class").indexOf("waveform") != -1) {

                // dynamically set the attributes of these divs so
                // that the width and height of the wavegroup's
                // waveforms are specified once as wavegroup
                // attributes in the html.
                attrs.set("w", waveformW);
                attrs.set("h", waveformH);
                attrs.set("duration", waveformDuration);
                this.waveforms[attrs.get("name")] = new Waveform(el);
            }
        });
        
    }
}
