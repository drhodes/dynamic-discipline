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
}


