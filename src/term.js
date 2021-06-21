import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Wire} from './wire.js';

export class Term {
    constructor(ctx, scale, name, x, y) {
        const S = this.scale = scale;
        this.x = x;
        this.y = y;
        this.name = name;
        this.wire = new Wire(ctx, x, y);
        this.wire.rt(this.leadLength()).done().init().dashed();        
        this.wire.animate();

        this.text = ctx.text(name)
            .fill("blue")
            .font({family: 'Courier'})
            .move(x,y);
    }

    nudgeLabel(dx, dy) {
        this.text.move(this.x + this.scale*dx, this.y + this.scale*dy);
    }
    
    leadLength() {
        return this.scale;
    }

    rotate(deg) {
        this.wire.rotate(deg);
    }
}

class WireState {
    constructor(ctx) {        
    }
}

class WireStateH extends WireState{}
class WireStateL extends WireState{}
class WireStateU extends WireState{}
