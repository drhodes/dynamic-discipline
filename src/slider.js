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
        this.value = 0;
        this.ctx.size(700, 30); // TODO get these sizes from parent.

        this.labelText = this.ctx
            .text(attrs.get("name"))
            .fill(color.GRAY3)
            .font({family: SCM_FONT, size: 16 })
            .move(60, 4);
        
        this.setup();
        
        this.numberText = this.ctx
            .text("0.00ns")
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
        
        this.rect = this.ctx.rect(200, 20)
            .move(120, 3)
            .fill(gradient)
            .stroke({width: 1, color: "#AAA"});
        this.knob = this.ctx.rect(18, 18)
            .move(121, 4)
            .fill(color.GRAYD)
            .stroke({width: 1, color: "#AAA"});

        var dragging=false;
        this.ctx.mouseleave(function() { dragging=false; });
        this.ctx.mouseup(function() { dragging=false; });
        
        let heel = ev => {
            let newx = ev.layerX-9;
            this.knob.move(newx, 4);
            let v = (this.max-this.min) * ((newx-120)/182).toFixed(2);
            this.setValue(v);
        };

        let outOfBoundsRight = ev => ev.layerX >= 320-9;
        let outOfBoundsLeft = ev => ev.layerX <= 120+9;
        let inbounds = ev => !outOfBoundsLeft(ev) && !outOfBoundsRight(ev);

        this.ctx.mousedown(function(ev) {
            dragging=true;
            if (inbounds(ev)) heel(ev); 
        });

        
        this.ctx.mousemove(ev => {
            if (dragging && inbounds(ev)) heel(ev);
            if (dragging && outOfBoundsLeft(ev)) { this.knob.move(120+1); }
            if (dragging && outOfBoundsRight(ev)) { this.knob.move(320-19); }
        });
    }

    setValue(v) {
        this.value = v;
        this.numberText.text(v + "ns");
    }
}
