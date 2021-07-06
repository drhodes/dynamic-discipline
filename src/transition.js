import {die, log} from './err.js';

export const L = "0";
export const H = "1";
export const X = "X";

export class Transition {
    constructor(t, duration, logicVal) {        
        this.t = t ; // this should be absolute time when transition occurs!
        this.duration = duration;
        this.value = logicVal; // L, H or X.        

        
        // The sig constructor needs to set these. g
        this.prevTransition = null;
        this.nextTransition = null;
        this.handleDeltaT = 0;
        this.id = Math.random();
    }

    adjTime() {
        return this.t + this.handleDeltaT;
    }
    
    set prevTransition(v) { this._prevTransition = v; }
    set nextTransition(v) { this._nextTransition = v; }

    get prevTransition() { return this._prevTransition; }
    get nextTransition() { return this._nextTransition; }
    isSliding() { return false; }
    
}

export class SlidingTransition extends Transition {
    constructor(t, duration, logicValue, slideTimeLeft, slideTimeRight) {        
        super(t, duration, logicValue);        
        this.slideTimeLeft = slideTimeLeft;
        this.slideTimeRight = slideTimeRight;
    }

    updateHandleDeltaT(dt) {
        this.handleDeltaT = dt;
    }

    get handleDeltaT() { return this._handleDeltaT; }
    set handleDeltaT(dt) { this._handleDeltaT = dt; }
    
    isSliding() { return true; }
}

