import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {SlidingTransition, Transition} from './transition.js';
import {L, H, X} from './transition.js';

export class Sig {
    // "L 10 H 20 L 20 X 10"
    constructor(sigString, duration) {
        this.duration = duration;
        this.transitions = [];        
        this.parse(sigString);
    }
    
    parse(sigString) {
        let regex = /(L|H|X|<H>)\s([0-9]*)/g;
        let matches = [...sigString.matchAll(regex)];

        function isSlidingTransition(m) {
            return m[1] == "<L>" || m[1] == "<H>";
        }
        
        matches.forEach(m => {
            let value =
                m[1] == "L" ? L :
                m[1] == "<L>" ? L :
                m[1] == "H" ? H :
                m[1] == "<H>" ? H :
                m[1] == "X" ? X : die("unrecognized logic value: "+ m[1]);
                
            let duration = Number.parseFloat(m[2]);
            if (Number.isNaN(duration)) die("Couldn't parse: " + m[2] + " as a duration");
            
            if (isSlidingTransition(m)) {
                const SLIDE_TIME = 10;
                // TODO, add syntax to regex to specify slide time.
                // something like <div class="waveform" name="B" sig="L 20 <H14> 20"></div>
                // where <H14> is a sliding transition to H with slidetime = 14.
                // slidetime must be less than the surrounding durations.
                
                this.transitions.push(new SlidingTransition(duration, value, SLIDE_TIME));
            } else {
                this.transitions.push(new Transition(duration, value));
            }
        });
    }

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

    adjustTransition(n, dx) {
        if (n==0) die("can't adjust the first transition");
        if (n>=this.transitions.length) die("transition index out of range");
        // 
    }

}


