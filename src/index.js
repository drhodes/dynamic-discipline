import * as SVG from '@svgdotjs/svg.js';
import {Poly} from './poly.js';

function log(msg) { console.log("dyndisc> " + msg); }

// -----------------------------------------------------------------------------
class Wire1 {
    constructor() {
        let width = 800;
        let height = 100;        
        let ctx = SVG.SVG().addTo("#wire1").size(width, height);
        let poly = new Poly(ctx, 10, 50).rt(700);
        poly.done().dashed();
        
        let p2 = poly.clone().done();
        
        function foof() {
            p2.remove();
            poly.update();
            p2 = poly
                .clone().subdivide(8).randomize(20).done()
                .color("#777").width(1);
            
            window.requestAnimationFrame(foof);
        }
        foof();
    }
    
    update() {
    }
}

new Wire1();

