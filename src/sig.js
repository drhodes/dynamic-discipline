import * as SVG from '@svgdotjs/svg.js';
import {die, log, ok, err, unimplemented} from './err.js';
import {SlidingTransition, Transition} from './transition.js';
import {L, H, X} from './transition.js';

const nope = {ok: false, value:null};

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
        //this.setPrevNextVals();
    }

    setPrevNextVals() {
        for (var i=1; i<this.transitions.length-1; i++) {
            let prevT = this.transitions[i-1];
            let curT =  this.transitions[i];

            curT.prevTransitionValue = prevT.value;

            if (i < this.transitions.length) {
                let nextT = this.transitions[i+1];
                curT.nextTransitionValue = nextT.value;
            }
            
        }
    }
 
    valueAtTime(t) {
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

