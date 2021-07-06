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
        let tr = this.transition;
        
        // moving transitions have slidetime in addition to the
        // properties on plain transitions.
        const LEFT_MARGIN = this.constants.LEFT_MARGIN;
        const HANDLE_HEIGHT = this.parent.heightPx; //30;
        const HANDLE_WIDTH = 10;
        
        let x = this.parent.pxFromTime(tr.t) + LEFT_MARGIN;
        let y = this.parent.heightPx / 2 - HANDLE_HEIGHT/2;
        
        const BOUNDS_LEFT = x - this.parent.pxFromTime(tr.slideTimeLeft);
        const BOUNDS_RIGHT = x + this.parent.pxFromTime(tr.slideTimeRight);
        const BOUNDS_WIDTH = BOUNDS_RIGHT - BOUNDS_LEFT;
        const BOUNDS_HEIGHT = HANDLE_HEIGHT;
        
        
        let handleX = x - HANDLE_WIDTH/2;

        function inBounds(x) {
            return BOUNDS_LEFT < x && x < BOUNDS_RIGHT;
        }
        //debugger;
        let bounds = this.ctx
            .rect(BOUNDS_WIDTH, BOUNDS_HEIGHT)
            .fill(color.GRAY5T1)
            .move(BOUNDS_LEFT, 0);
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
            tr.updateHandleDeltaT(dt);
            handle.move(newx, y);
        };
        
        handle.mouseover(function(ev) {
            // this is a reference to: handle
            this.fill(color.SCHEM_BLUE);
        });
        
        handle.mouseout(function(ev) {
            this.fill(color.SCHEM_BLUE_TRANSLUCENT);
        });
        
        handle.mousedown(ev => { dragging = inBounds(ev.layerX); heel(ev); });
        handle.mousemove(ev => { if (inBounds(ev.layerX) && dragging) heel(ev); });
        this.parent.rect.mousemove(ev => { if (inBounds(ev.layerX) && dragging) heel(ev); });
        
          
        bounds.mousemove(ev => {
            if (!inBounds(ev.layerX)) {
                dragging = false;
            } else if (inBounds(ev.layerX) && dragging) {
                heel(ev);
            }
        });
        
        bounds.mousedown(function(ev) { if (inBounds(ev.layerX)) { heel(ev); dragging = true; }});
        handle.mouseup(ev => dragging = false );
        bounds.mouseup(ev => dragging = false );

        // NEWS events bound to this.ctx are much more reliable.
        this.ctx.mouseup(ev => dragging = false);
    }
}


