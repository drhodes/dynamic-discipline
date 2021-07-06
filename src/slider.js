import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {SCM_FONT} from './font.js';
import {Attributes} from './attrs.js';
import * as color from './color.js';


export class Slider {
    constructor(div) {
        this.ctx = SVG.SVG().addTo(div);
        let attrs = new Attributes(div);
        this.min = attrs.getAsNum("min");
        this.max = attrs.getAsNum("max");
        this.default = attrs.getAsNum("default");
        this.value = this.default;
        this.ctx.size(700, 30); // TODO get these sizes from parent.

        this.labelText = this.ctx
            .text(attrs.get("name"))
            .fill(color.GRAY3)
            .font({family: SCM_FONT, size: 16 })
            .move(60, 4);
        
        this.setup();
        
        this.numberText = this.ctx
            .text(this.value + " ns")
            .fill(color.GRAY3)
            .font({family: SCM_FONT, size: 16 })
            .move(122, 4);
        

    }

    setup() {
        let gradient = this.ctx.gradient('linear', function(add) {
            add.stop(0, '#fff');
            add.stop(1, '#ddd');
        });
        gradient.rotate(90); 

        const BOUNDS_WIDTH = 200;
        const BOUNDS_HEIGHT = 20;
        const BOUNDS_LEFT = 120;
        const BOUNDS_TOP = 3;

        const BORDER = 1;
        
        const KNOB_WIDTH = BOUNDS_HEIGHT- 2*BORDER;
        const KNOB_HEIGHT = BOUNDS_HEIGHT - 2*BORDER;
        const KNOB_LEFT = BOUNDS_LEFT + BORDER;
        const KNOB_RIGHT = BOUNDS_LEFT + BOUNDS_WIDTH - BORDER - KNOB_WIDTH;
        const KNOB_TOP = BOUNDS_TOP + BORDER;
        
        const KNOB_TRAVEL_SPAN = KNOB_RIGHT - KNOB_LEFT;

        // translate slider values to pixel value
        let valueToPx = v => {
            let valueSpan = this.max - this.min;
            let pixelSpan = KNOB_TRAVEL_SPAN;

            let pixelsPerValue = pixelSpan / valueSpan;
            let valuePixelSpan = pixelsPerValue * v;

            return KNOB_LEFT + valuePixelSpan;
        };

        // draw the slider background
        this.rect = this.ctx.rect(BOUNDS_WIDTH, BOUNDS_HEIGHT)
            .move(BOUNDS_LEFT, BOUNDS_TOP)
            .fill(gradient)
            .stroke({width: 1, color: color.GRAYA});

        let knobX = valueToPx(this.default);
        
        // draw the slider knob
        this.knob = this.ctx.rect(KNOB_WIDTH, KNOB_HEIGHT)
            .move(knobX, KNOB_TOP)
            .fill(color.GRAYD)
            .stroke({width: 1, color: color.GRAYA});
        
        // deal with events
        var dragging=false;
        this.ctx.mouseleave(function() { dragging=false; });
        this.ctx.mouseup(function() { dragging=false; });
        
        let heel = ev => {
            let newx = ev.layerX-9;
            this.knob.move(newx, 4);
            let v = (this.max-this.min) * ((newx-BOUNDS_LEFT)/(KNOB_TRAVEL_SPAN)).toFixed(2);
            this.setValue(v);
        };

        let outOfBoundsRight = ev => ev.layerX >= KNOB_RIGHT + KNOB_WIDTH/2;
        let outOfBoundsLeft = ev => ev.layerX <= BOUNDS_LEFT+KNOB_WIDTH/2;
        let inbounds = ev => !outOfBoundsLeft(ev) && !outOfBoundsRight(ev);

        this.ctx.mousedown(function(ev) {
            dragging=true;
            if (inbounds(ev)) heel(ev); 
        });
        
        this.ctx.mousemove(ev => {
            if (dragging && inbounds(ev)) heel(ev);
            if (dragging && outOfBoundsLeft(ev)) { this.knob.move(BOUNDS_LEFT+BORDER); }
            if (dragging && outOfBoundsRight(ev)) { this.knob.move(KNOB_RIGHT); }
        });
    }

    setValue(v) {
        this.value = v;
        this.numberText.text(v + "ns");
    }
}
