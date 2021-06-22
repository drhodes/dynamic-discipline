import {die, log} from './err.js';

export const L = "0";
export const H = "1";
export const X = "X";

export class Transition {
    constructor(duration, logicValue) { // riseTime? May not need to consider this yet!
        this.t = duration;
        // L, H or X.        
        this.value = logicValue;
    }
}

