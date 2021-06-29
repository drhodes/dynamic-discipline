import {die, log} from './err.js';

export const L = "0";
export const H = "1";
export const X = "X";

export class Transition {
    constructor(t, duration, logicVal) {        
        this.t = t ; // this should be absolute time when transition occurs!
        this.duration = duration;
        // L, H or X.        
        this.value = logicVal;
        
        // The sig constructor needs to set these. g
        this.prevTransitionValue = null;
        this.nextTransitionValue = null;
        this.handleDeltaT = 0;
    }

    set prevTransitionValue(v) { this._prevTransitionValue = v; }
    set nextTransitionValue(v) { this._nextTransitionValue = v; }

    get prevTransitionValue() { return this._prevTransitionValue; }
    get nextTransitionValue() { return this._nextTransitionValue; }
    isSliding() { return false; }
}


export class SlidingTransition extends Transition {
    constructor(t, duration, logicValue, slidetime) {        
        super(t, duration, logicValue);        
        this.slidetime = slidetime;
        this.handleDeltaT = 0;
    }

    updateHandleDeltaT(dt) {
        this.handleDeltaT = dt;
    }

    get handleDeltaT() { return this._handleDeltaT; }
    set handleDeltaT(dt) { this._handleDeltaT = dt; }
    
    isSliding() { return true; }
}

