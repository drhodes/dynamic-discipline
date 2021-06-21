import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Transition} from './transition.js';
import {L, H, X} from './transition.js';

export class Sig {
    // "L 10 H 20 L 20 X 10"
    constructor(sigString) {        
        this.transitions = [];        
        this.parse(sigString);
    }

    parse(sigString) {
        let regex = /([L,H,X])\s([0-9]*)/g;        
        let matches = [...sigString.matchAll(regex)];
        
        matches.forEach(m => {
            let value =
                m[1] == "L" ? L :
                m[1] == "H" ? H :
                m[1] == "X" ? X : die("unrecognized logic value: "+ m[1]);
                
            let duration = Number.parseFloat(m[2]);
            if (Number.isNaN(duration)) die("Couldn't parse: " + m[2] + " as a duration");
            
            this.transitions.push(new Transition(duration, value));
        });
    }

    // This should probably be a look up table
    // precomputed when the sig is initialized.  In fact, the sig should handle this
    valueAtTime(t) {
        let curTime = 0;
        let result = {ok:false, val:-1};
        this.transitions.every(trans => {
            if (t >= curTime && t < curTime + trans.t) {
                result = {ok: true, val: trans.value};
                return false; // break 
            }
            curTime += trans.t;
            return true; // continue
        });
        return result;
    }
}


