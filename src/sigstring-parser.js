import {die, log, ok, err, unimplemented} from './err.js';
import {contains} from './util.js';
import {SlidingTransition, Transition} from './transition.js';
import {L, H, X} from './transition.js';

export class SigStringParser {
    constructor(sigString) {
        this.sigString = sigString;
        this.transitions = [];
        this.parse();
    }

    isSlidingTransition(m) {
        return m[1].startsWith("<") && m[1].endsWith(">");
    }
    
    parse() {
        let regex = /(L|H|X|(<([0-9]+)H([0-9]+)>)|(<([0-9]+)L([0-9]+)>)|(<([0-9]+)X([0-9]+)>))\s([0-9]*)/g;
        let matches = [...this.sigString.matchAll(regex)];
        
        let curTime = 0;
        
        matches.forEach(m => {            
            let value =
                contains(m[1], "L") ? L :
                contains(m[1], "H") ? H :
                contains(m[1], "X") ? X : die("unrecognized logic value: "+ m[1]);
            
            if (this.isSlidingTransition(m)) {
                curTime += this.processSlidingTransition(curTime, m, value);                
            } else {
                curTime += this.processTransition(curTime, m, value);                
            }
        });
    }

    processTransition(curTime, m, value) {
        let duration = Number.parseFloat(m[11]);
        if (Number.isNaN(duration)) die("Couldn't parse: " + m[11] + " as a duration");
        this.transitions.push(new Transition(curTime, duration, value));
        return duration;
    }

    processSlidingTransition(curTime, m, value) {
        let duration = Number.parseFloat(m[11]);
        if (Number.isNaN(duration)) die("Couldn't parse: " + m[11] + " as a duration");

        let idx =
            value == H ? 3 :
            value == L ? 6 :
            value == X ? 9 : die("unrecognized logic value: " + value);
        
        var slideTimeLeft = Number.parseFloat(m[idx]);
        var slideTimeRight = Number.parseFloat(m[idx+1]);
        console.log([slideTimeLeft, slideTimeRight]);        
        this.transitions.push(new SlidingTransition(curTime, duration, value, slideTimeLeft, slideTimeRight));
        return duration;
    }
}
