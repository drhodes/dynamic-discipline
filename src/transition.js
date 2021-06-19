import {die, log} from './err.js';

export const L = "LOW";
export const H = "HIGH";
export const X = "INVALID";

export class Transition {
    constructor(duration, logicValue) { // riseTime? May not need to consider this yet!
        this.t = duration;
        // L, H or X.        
        this.value = logicValue;
    }
}

