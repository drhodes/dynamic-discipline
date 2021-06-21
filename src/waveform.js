import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Poly} from './poly.js';
import {Transition} from './transition.js';
import {Sig} from './sig.js';
import {L, H, X} from './transition.js';
import * as util from './util.js';
import {Attributes} from './attrs.js';

const BACKGROUND_COLOR = "#d6f7ff";
const BORDER_COLOR = "#aaa";
const WAVE_COLOR = "#000";
const WAVE_WIDTH = 3; // pixels, the width of the wave line.
const LEFT_MARGIN = 40; // margin for signal name on the left.

// A waveform
//
// Use declarative definition in html
//
// <div ... name="Q" sig="L 10 H 20 L 20 X 10"  h="40" w="700"></div>
//

export class Waveform {
    // extends event harness, an event dispatcher
    // for objects.???  think about it.
    
    constructor(div, parent, w, h, duration) {
        // An interactive signal which is optionally associated with
        // circuit terminal.
        this.parent = parent;
        this.div = div;
        this.attrs = new Attributes(div);
        this.duration = duration;

        this.currentTime = 0;
        
        // TODO if transitions does not contain a transition at an instant
        // in time equal to the duration - that is - the last
        // transition happens at some point in the middle of the
        
        this.sig = new Sig(this.attrs.get("sig"));
        this.transitions = this.sig.transitions;
        
        this.heightPx = h;
        this.widthPx = w;
        this.name  = this.attrs.get("name");

        this.ctx = SVG.SVG().addTo(div).size(this.widthPx, this.heightPx);
        this.render();
    }
    
    registerEvents() {
        // OK. before abstracting this out what, what does it need to do?

        // Need a timeline to show the current time.  need to fetch
        // values (quickly) from the waveform, given a time, what is
        // the value?
        
    }

    updateTimeLine(x) {
        this.timeline.move(x, 0);
        this.currentTime = this.timeFromPx(x);
    }

    getCurrentTime() {
        return this.currentTime;
    }
    
    pxFromTime(ns) {
        // Find the x coordinate pixel associated with a time.  This
        // is a linear relationship, where the pixel width of the
        // waveform and the total duration of the waveform measure the
        // same screen distance
        
        let m = (this.widthPx - LEFT_MARGIN)/this.duration;
        return m * ns; // :: (pixels/time) * time = pixels
    }

    timeFromPx(x) {
        // Find the time associated with the x-coordinate.  This
        // is a linear relationship, where the pixel width of the
        // waveform and the total duration of the waveform measure the
        // same screen distance
        let m = (this.widthPx - LEFT_MARGIN)/this.duration;
        return (1/m) * x;        
    }
    
    // allocate mutable SVG elements
    render() {
        // background box.

        var rect = this.ctx
            .rect(this.widthPx-LEFT_MARGIN, this.heightPx)
            .fill(BACKGROUND_COLOR)
            .move(LEFT_MARGIN, 0);
        
        var topLine = this.ctx.line(LEFT_MARGIN, 0, this.widthPx, 0)
            .stroke({ width: 2, color:BORDER_COLOR });
        var bottomLine = this.ctx.line(LEFT_MARGIN, this.heightPx, this.widthPx, this.heightPx)
            .stroke({ width: 2, color:BORDER_COLOR });

        const BAND_OFFSET = 10;
        // funcspec lines
        var lineVOL = this.ctx
            .line(LEFT_MARGIN, BAND_OFFSET, this.widthPx, BAND_OFFSET)
            .stroke({ width: .5, color:BORDER_COLOR });
        var lineVOH = this.ctx
            .line(LEFT_MARGIN, this.heightPx - BAND_OFFSET, this.widthPx, this.heightPx - BAND_OFFSET)
            .stroke({ width: .5, color:BORDER_COLOR });

        this.renderName();
        this.renderWave();
        this.renderTimeLine();
    }

    renderName() {
        // put the signal label in the left margin, centered vertically.
        const TEXT_Y = this.heightPx / 2 - 8;
        const TEXT_X = 0;
        
        this.ctx.text(this.name)
            .fill("black")
            .font({family: 'Courier'})
            .move(TEXT_X, TEXT_Y);
    }

    renderTimeLine() {
        this.timeline = this.ctx
            .line(LEFT_MARGIN, 0, LEFT_MARGIN, this.heightPx)
            .stroke({ width: TIMELINE_WIDTH, color:TIMELINE_COLOR });
 
        this.ctx.on('mousemove', ev => {
            if (ev.layerX > LEFT_MARGIN && ev.layerX < this.widthPx) {
                this.parent.updateTimeLine(ev.layerX);
            }
            // need to push this event onto a queue, shared with the
            // parent group.
        });
        
    }
    
    renderWave() {
        const BOTTOM_BORDER = this.heightPx - WAVE_WIDTH/2; // hug the bottom border.
        const TOP_BORDER = 0 + WAVE_WIDTH/2;             // hug the top border.
        const RIGHT_BORDER = this.widthPx;
        const RISEFALL_DISTANCE = this.heightPx - WAVE_WIDTH;

        var ts = this.sig.transitions;
        let polyline;
       
        switch (ts.length) {
        case 0 :
            // if transitions is an empty list then the waveform
            // should be zero for all time.
            
            polyline = new Poly(this.ctx, 0, BOTTOM_BORDER);
            polyline.rt(RIGHT_BORDER);
            break;
            
        default:
            // One or many transitions.
            
            var curValue = ts[0].value;
            var dx = this.pxFromTime(ts[0].t);
            var curX = LEFT_MARGIN;            
            var curY = curValue == H ? TOP_BORDER : BOTTOM_BORDER;

            // start at the right logic value
            polyline = new Poly(this.ctx, curX, curY);
            polyline.rt(dx);

            ts.slice(1).map(trans => {
                // only transition from hi to low or vice versa if the
                // wave changes logic value.
                if (curValue != trans.value) {
                    if (curValue == L) {
                        polyline.up(BOTTOM_BORDER - WAVE_WIDTH/2);
                    } else {
                        polyline.dn(BOTTOM_BORDER - WAVE_WIDTH/2);
                    }
                }
                
                var dx = this.pxFromTime(trans.t);
                polyline.rt(dx);
                curValue = trans.value;
            });
        }
        
        // TODO need to refactor polyline to remove the requirement to call .done() 
        polyline.done().color("black").width(WAVE_WIDTH);
    }
}
