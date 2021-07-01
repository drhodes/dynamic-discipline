import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Wire} from './wire.js';
import {SCM_FONT} from './font.js';
import {L, H, X} from './transition.js';

export class Term {
    constructor(ctx, scale, name, x, y) {
        const S = this.scale = scale;
        this.x = x;
        this.y = y;
        this.name = name;
        this.value = X;
        this.wire = new Wire(ctx, x, y);
        this.wire.rt(this.leadLength()).done().init().dashed();        
        this.wire.animate();

        this.text = ctx.text(".")
            .fill("blue")
            .font({family: SCM_FONT, size: 20 })
            .move(x,y);
        
        this.updateValue(this.value);
    }
    
    nudgeLabel(dx, dy) {
        this.text.move(this.x + this.scale*dx, this.y + this.scale*dy);
    }
    
    leadLength() { return this.scale; }
    rotate(deg) { this.wire.rotate(deg); }
    
    updateValue(v) {
        this.value = v;
        this.text.text(this.name + "=" + v);
        
        if (v == L) {
            this.wire.color("green");
        } else if (v == H) {       
            this.wire.color("red");
        } else if (v == X) {
            this.wire.color("gray");
        } else {
            this.wire.color("yellow");
        }
    }

    getPoints() { return this.wire.getPoints(); }
}

class WireState {
    constructor(ctx) {        
    }
}

class WireStateH extends WireState{}
class WireStateL extends WireState{}
class WireStateU extends WireState{}
