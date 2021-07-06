import * as SVG from '@svgdotjs/svg.js';
import * as util from './util.js';
import * as color from './color.js';
import {die, log} from './err.js';


export class TransitionHandle {
    constructor(ctx, parent, transition, constants) {
        this.parent = parent;
        this.ctx = ctx;
        this.transition = transition;
        this.constants = constants;
        this.setup();
    }

    setup() {
        let transition = this.transition;
        
        // moving transitions have slidetime in addition to the
        // properties on plain transitions.
        const LEFT_MARGIN = this.constants.LEFT_MARGIN;
        const HANDLE_HEIGHT = this.parent.heightPx; //30;
        const HANDLE_WIDTH = 10;
        const BOUNDS_WIDTH = this.parent.pxFromTime(transition.slidetime);
        const BOUNDS_HEIGHT = HANDLE_HEIGHT;
        
        let x = this.parent.pxFromTime(transition.t) + LEFT_MARGIN;
        let y = this.parent.heightPx / 2 - HANDLE_HEIGHT/2;
        
        let boundsX = x - BOUNDS_WIDTH/2; 
        let handleX = x - HANDLE_WIDTH/2;

        function inBounds(x) {
            var left = boundsX;
            var right = boundsX + BOUNDS_WIDTH;
            return left < x && x < right;
        }
        
        let bounds = this.ctx
            .rect(BOUNDS_WIDTH, BOUNDS_HEIGHT)
            .fill(color.GRAY5T1)
            .move(boundsX, y+HANDLE_HEIGHT/2 - BOUNDS_HEIGHT/2);
        let handle = this.ctx.rect(HANDLE_WIDTH, HANDLE_HEIGHT); 
        
        let dragging = false;
        
        handle
            .move(handleX, y)
            .fill(color.SCHEM_BLUE_TRANSLUCENT)
        ;

        // might actually need a state machine for this.
        
        let heel = ev => {
            let newx = ev.layerX-HANDLE_WIDTH/2;
            let dx = ev.layerX - x;
            let dt = this.parent.deltaTimeFromPx(dx);
            transition.updateHandleDeltaT(dt);
            handle.move(newx, y);
        };
        
        handle.mouseover(function(ev) { this.fill(color.SCHEM_BLUE); });        
        handle.mouseout(function(ev)  { this.fill(color.SCHEM_BLUE_TRANSLUCENT); });
        
        handle.mousedown(function(ev) {
            dragging = inBounds(ev.layerX);
            heel(ev);
        });
        
        handle.mouseup(function(ev)   { dragging = false; });
        handle.mousemove(function(ev) {
            if (inBounds(ev.layerX) && dragging) heel(ev);
        });

        this.parent.rect.mousemove(ev => {
            if (inBounds(ev.layerX) && dragging) heel(ev);
        });
        this.parent.rect.mouseup(ev => { dragging = false; });
        this.parent.rect.mousedown(function(ev) {
            if (inBounds(ev.layerX)) {
                heel(ev); dragging = true; }
        });
        
        bounds.mousemove(ev => { if (inBounds(ev.layerX) && dragging) heel(ev); });
        bounds.mouseup(ev => { dragging = false; });
        bounds.mousedown(function(ev) { if (inBounds(ev.layerX)) { heel(ev); dragging = true; }});
    }

}


