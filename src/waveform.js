import * as SVG from '@svgdotjs/svg.js';
import * as util from './util.js';
import * as color from './color.js';
import {die, log} from './err.js';
import {Poly} from './poly.js';
import {Transition} from './transition.js';
import {TransitionHandle} from './transition-handle.js';
import {Sig, SigFunc} from './sig.js';
import {L, H, X} from './transition.js';
import {Attributes} from './attrs.js';
import {SCM_FONT} from './font.js';
import {WaveLine} from './waveline.js';

const BACKGROUND_COLOR = "#efefef33"; // "#efefef";
const BORDER_COLOR = "#CCC"; 
const WAVE_COLOR = "#3333FF77";
const WAVE_WIDTH = 2.6; // pixels, the width of the wave line.
const LEFT_MARGIN = 40; // margin for signal name on the left.

const FONT_COLOR = "#444";
const TIMELINE_WIDTH = 2;
const TIMELINE_COLOR = "#00FF00AA";

// A waveform
//
// Use declarative definition in html
//
// <div class="waveform" name="Q" sig="L 6 H 5 H 5 H 5 L 5 L 5 H 5 L 5" type="out"></div>
// <div class="waveform" name="Q" sig="and(not(A), not(B))" type="out"></div>
// 

export class Waveform {
    constructor(div, parent, w, h, duration) {
        // An interactive signal which is optionally associated with
        // circuit terminal.
        this.parent = parent;
        this.div = div;
        this.attrs = new Attributes(div);
        this.duration = duration;
        this.currentTime = 0;

        if (this.attrs.hasAttr("func")) {
            this.sig = new SigFunc(this.attrs.get("sig"), duration, this);
        } else {
            this.sig = new Sig(this.attrs.get("sig"), duration, this);
        }
        
        this.transitions = this.sig.transitions;
        
        this.heightPx = h;
        this.widthPx = w;
        this.name = this.attrs.get("name");
       
        this.ctx = SVG.SVG().addTo(div);
        this.ctx.size(this.widthPx, this.heightPx);

        this.waveline = new WaveLine(this.ctx, this.sig, h, w-LEFT_MARGIN, LEFT_MARGIN, 10);
        this.render();
        this.registerEvents();
    }

    setSpecialSigFunc(f) {
        this.sig.setSpecialSigFunc(f);
    }
    
    updateTimeLine(x) {
        this.timeline.move(x, 0);
        this.currentTime = this.timeFromPx(x);
    }

    getCurrentTime() { return this.currentTime; }
    
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
        let t = (1/m) * (x - LEFT_MARGIN);
        return t;
    }

    deltaTimeFromPx(dx) {
        let nsPerPixel = this.duration / (this.widthPx - LEFT_MARGIN);
        return nsPerPixel*dx;
    }
    
    // allocate mutable SVG elements
    render() {
        // background box.
        this.renderBackground();
        this.renderName();
        this.renderTimeLine();
        this.renderWave();
    }

    renderBackground() {
        var rect = this.rect = this.ctx
            .rect(this.widthPx-LEFT_MARGIN, this.heightPx)
            .fill(BACKGROUND_COLOR)
            .move(LEFT_MARGIN, 0);
        var topLine = this.ctx.line(LEFT_MARGIN, 0, this.widthPx, 0)
            .stroke({ width: 1, color:BORDER_COLOR });
        var bottomLine = this.ctx.line(LEFT_MARGIN, this.heightPx, this.widthPx, this.heightPx)
            .stroke({ width: 1, color:BORDER_COLOR });

        const BAND_OFFSET = 5; // TODO determine by functional spec
        var lineVOL = this.ctx
            .line(LEFT_MARGIN, BAND_OFFSET, this.widthPx, BAND_OFFSET)
            .stroke({ width: .25, color:BORDER_COLOR });
        var lineVOH = this.ctx
            .line(LEFT_MARGIN, this.heightPx - BAND_OFFSET, this.widthPx, this.heightPx - BAND_OFFSET)
            .stroke({ width: .25, color:BORDER_COLOR });
    }
    
    renderName() {
        // put the signal label in the left margin, centered vertically.
        const TEXT_Y = this.heightPx / 2 - 12;
        const TEXT_X = 0;
        
        this.ctx.text(this.name)
            .fill(FONT_COLOR)
            .font({family: SCM_FONT, size: 22 })
            .move(TEXT_X, TEXT_Y);
    }

    renderTimeLine() {
        this.timeline = this.ctx
            .line(LEFT_MARGIN, 0, LEFT_MARGIN, this.heightPx)
            .stroke({ width: TIMELINE_WIDTH, color:TIMELINE_COLOR });
    }

    registerEvents() {
        this.ctx.on('mousemove', ev => {
            if (ev.layerX > LEFT_MARGIN && ev.layerX < this.widthPx) {
                // TODO DEBUG FIREFOX try logging ev.layerX to see if
                // it reports the same value that chrome does.
                this.curX = ev.layerX;
                this.parent.updateTimeLines(ev.layerX);
                this.parent.updateBench();
            }
        });
    }

    getCurValue() {
        return this.sig.valueAtTime(this.currentTime);
    }
    
    renderWave() {
        this.sig.transitions.slice(1).forEach(trans => {  
            if (trans.isSliding()) {
                let constants = {LEFT_MARGIN: LEFT_MARGIN};
                new TransitionHandle(this.ctx, this, trans, constants);
            }
        });
    }
}
