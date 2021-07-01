import * as SVG from '@svgdotjs/svg.js';
import {die, log, ok, err, unimplemented} from './err.js';
import {SlidingTransition, Transition} from './transition.js';
import {L, H, X} from './transition.js';

const nope = {ok: false, value:null};

export class Sig {
    // "L 10 H 20 L 20 X 10"
    constructor(sigString, duration, parent) {
        this.parent = parent;
        this.duration = duration;
        this.transitions = [];
        this.sigString = sigString;
        this.parse(sigString);
    }
    
    parse(sigString) {
        let regex = /(L|H|X|<H>|<L>)\s([0-9]*)/g;
        let matches = [...sigString.matchAll(regex)];

        function isSlidingTransition(m) {
            return m[1] == "<L>" || m[1] == "<H>";
        }

        let curTime = 0;
        
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
                
                this.transitions.push(new SlidingTransition(curTime, duration, value, SLIDE_TIME));
            } else {
                this.transitions.push(new Transition(curTime, duration, value));
            }
            curTime += duration;
        });
    }
    
    valueAtTime(t) {
        if (t < 0) return X;
        
        for (var i=0; i<this.transitions.length; i++) {
            let onLastTransitionP = i == this.transitions.length - 1;            
            var curTrans = this.transitions[i];
            let cs = curTrans.isSliding();
            
            if (!onLastTransitionP) {
                let nextTrans = this.transitions[i+1];
                if (curTrans.t <= t && t <= (nextTrans.t + nextTrans.handleDeltaT)) {
                    return curTrans.value; //curTrans.value;
                }                
            } else {
                // on last transition
                if (curTrans.t <= t <= curTrans.t + curTrans.duration) {
                    return curTrans.value;
                }                
            }
        }
        return X;
    }
}



export class SigFunc extends Sig {
    constructor(sigString, duration, parent) {
        super(sigString, duration, parent);
        this.valueFunc = null;
    }
    
    parse(sigString) {
        // do nothing.
    }

    // math puzzle. take any non-trivial uniformly random stream of
    // real numbers and partition them evenly into two sets.
    
    valueAtTime(t) {
        const TPD = 2; // this is just for testing, TPD will need to be with the device.
        
        // these names (A&B) need to be extracted from the sigstring
        var A = this.parent.parent.getWaveform("A").sig;
        var B = this.parent.parent.getWaveform("B").sig;

        function and(x, y) {
            let vx = x.valueAtTime(t-TPD);
            let vy = y.valueAtTime(t-TPD);
            
            if (vx == X || vy == X) return X;
            if (vx == H && vy == H) return H;
            return L;
            
        }

        return eval(this.sigString);
    }    
}
