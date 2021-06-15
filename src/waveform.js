import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';

// A waveform
//
// Use declarative definition in html
//
// <div id="wave-id1" name="Q" group="1"></div>

class Transition {
    constructor() {
        // Where the wave changes from low to high, or from high to
        // low.
    }
}


class WaveHandle {
    constructor() {
        // this belongs with a transition
    }
}

class FunctionalSpec {
    constructor(vil, vol, vih, voh) {
        // An interactive signal which is optionally associated with
        // circuit terminal.
        this.vil = vil;
        this.vol = vol;
        this.vih = vih;
        this.voh = voh;
    }
}

class Attributes {
    constructor(div) {
        this.div = div;
    }
    getAttr(name) {
        let val = this.div.getAttribute(name);
        if (val) return val;
        die("could not find attr: " + name);        
    }    
}


export class Waveform {
    constructor(div, transitions, funcSpec) {
        // An interactive signal which is optionally associated with
        // circuit terminal.
        this.div = div;
        this.funcSpec = funcSpec;
        this.attrs = new Attributes(div);
        this.heightPx = this.attrs.getAttr("h");
        this.widthPx = this.attrs.getAttr("w");

        var elementId = "#" + this.attrs.getAttr("id");
        this.ctx = SVG.SVG().addTo(elementId).size(this.widthPx, this.heightPx);
        this.render();        
    }

    render() {
        // background box.
        const BACKGROUND_COLOR = "#c5e6ee";
        const BORDER_COLOR = "#999";

        var rect = this.ctx
            //.rect(this.widthPx, this.heightPx)
            .rect(this.widthPx, this.heightPx)
            .fill(BACKGROUND_COLOR);
        
        var topLine = this.ctx.line(0, 0, this.widthPx, 0)
            .stroke({ width: 2, color:BORDER_COLOR });
        var bottomLine = this.ctx.line(0, this.heightPx, this.widthPx, this.heightPx)
            .stroke({ width: 2, color:BORDER_COLOR });
        
        
        // funcspec lines        

        

    }
}
