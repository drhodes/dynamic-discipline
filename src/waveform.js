import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {L, H, X} from './sig.js';
import {Poly} from './poly.js';

// A waveform
//
// Use declarative definition in html
//
// <div id="wave-id1" name="Q" group="1"></div>

class Transition {
    constructor(t, logicValue) { // riseTime? May not need to consider this yet!
        this.t = t;
        // L, H or X.        
        this.value = logicValue;
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


const BACKGROUND_COLOR = "#d6f7ff";
const BORDER_COLOR = "#aaa";
const WAVE_COLOR = "#000";
const WAVE_WIDTH = 3; // pixels, the width of the wave line.

export class Waveform {
    // extends event harness, an event dispatcher
    // for objects.???  think about it.
    
    constructor(div, transitions, totalDuration, funcSpec) {
        // An interactive signal which is optionally associated with
        // circuit terminal.
        this.div = div;

        // TODO if transitions does not start at 0 then die.
        this.transitions = transitions.map(t => new Transition(t[0], t[1]));
        
        this.duration = totalDuration; 
        this.funcSpec = funcSpec;
        this.attrs = new Attributes(div);
        
        this.heightPx = this.attrs.getAttr("h");
        this.widthPx = this.attrs.getAttr("w");
        this.name  = this.attrs.getAttr("name");

        var elementId = "#" + this.attrs.getAttr("id");
        this.ctx = SVG.SVG().addTo(elementId).size(this.widthPx, this.heightPx);
        this.render();        
    }

    pxFromTime(ns) {
        // Find the x coordinate pixel associated with a time.  This
        // is a linear relationship, where the pixel width of the
        // waveform and the total duration of the waveform measure the
        // same screen distance
        
        let m = this.widthPx/this.duration;
        return m * ns; // :: (pixels/time) * time = pixels
    }
    
    
    // allocate mutable SVG elements
    render() {
        // background box.

        var rect = this.ctx
            //.rect(this.widthPx, this.heightPx)
            .rect(this.widthPx, this.heightPx)
            .fill(BACKGROUND_COLOR);
        
        var topLine = this.ctx.line(0, 0, this.widthPx, 0)
            .stroke({ width: 2, color:BORDER_COLOR });
        var bottomLine = this.ctx.line(0, this.heightPx, this.widthPx, this.heightPx)
            .stroke({ width: 2, color:BORDER_COLOR });

        const BAND_OFFSET = 10;
        // funcspec lines
        var lineVOL = this.ctx
            .line(0, BAND_OFFSET, this.widthPx, BAND_OFFSET)
            .stroke({ width: .5, color:BORDER_COLOR });
        var lineVOH = this.ctx
            .line(0, this.heightPx - BAND_OFFSET, this.widthPx, this.heightPx - BAND_OFFSET)
            .stroke({ width: .5, color:BORDER_COLOR });

        this.renderWave();
    }

    renderWave() {
        var ts = this.transitions;
        const BOTTOM_BORDER = this.heightPx - WAVE_WIDTH/2; // hug the bottom border.
        const TOP_BORDER = 0 + WAVE_WIDTH/2; // hug the top border.
        const RIGHT_BORDER = this.widthPx;
        
        let polyline;
        
        switch (ts.length) {
        case 0 :

            // if transitions is an empty list then the waveform
            // should be zero for all time.
            polyline = new Poly(this.ctx, 0, BOTTOM_BORDER);
            polyline.rt(RIGHT_BORDER);
            break;
            
        case 1:
            // if transitions is a list with only one transition then
            // the value of that transition should be the value of the
            // waveform for the entire duration.

            var y = ts[0].value == H ? TOP_BORDER : BOTTOM_BORDER;
            polyline = new Poly(this.ctx, 0, y);
            polyline.rt(RIGHT_BORDER);            
            break;
            
        default:
            // many transitions.
            var curValue = ts[0].value;
            var curX = 0;
            
            var y = curValue == H ? TOP_BORDER : BOTTOM_BORDER;
            polyline = new Poly(this.ctx, 0, y);

            ts.slice(1).map(trans => {
                var nextX = this.pxFromTime(trans.t);               
                y = trans.value == H ? TOP_BORDER : BOTTOM_BORDER;
                polyline.toAbs(curX,y);
                polyline.toAbs(nextX,y);
                curX = nextX;
            });
        }

        // need to refactor polyline to remove the requirement to call .done() 
        polyline.done().color("black").width(WAVE_WIDTH);
        
        // if transitions does not contain a transition at an instant
        // in time equal to the duration - that is - the last
        // transition happens at some point in the middle of the

    }

    
}
