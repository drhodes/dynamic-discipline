import * as SVG from '@svgdotjs/svg.js';
import {die, log, ok, err, unimplemented} from './err.js';
import {contains} from './util.js';
import {SlidingTransition, Transition} from './transition.js';
import {L, H, X} from './transition.js';
import {SigStringParser} from './sigstring-parser.js';

const nope = {ok: false, value:null};

export class Sig {
    // "L 10 H 20 L 20 X 10"
    constructor(sigString, duration, parent) {
        this.parent = parent;
        this.duration = duration;
        this.sigString = sigString;
        this.parser = new SigStringParser(sigString);
        this.transitions = this.parser.transitions;
        
        this.setupTransitionLinks();
        this.specialSigfunc = null;
    }

    setSpecialSigFunc(f) {
        this.specialSigfunc = f;
    }

    setupTransitionLinks() {
        // create a doubly-linked-list situation so transisitons can
        // see their neighbors.
        let ts = this.transitions;
        if (ts.length < 2) return;
        for (var i=1; i<ts.length-1; i++) {
            ts[i].prevTransition = ts[i-1];
            ts[i].nextTransition = ts[i+1];
        }
        ts[i].prevTransition = ts[i-1];
    }
    
    parse(sigString) {
    }

    valueAtTime(t) {
        if (t < 0) return X;
        let ts = this.transitions;
        
        if (ts.length == 0) return X;
        if (ts.length == 1) return ts[0].value;
        
        for (var i=1; i<ts.length; i++) {
            let trans = ts[i];
            if (trans.prevTransition.adjTime() <= t && t <= trans.adjTime()) {
                return trans.prevTransition.value;
            }
            if (trans.adjTime <= t && t <= trans.nextTransition.adjTime()) {
                return trans.value;
            }
            if (i == ts.length -1) return trans.value;
        }
        return X;
    }
}



export class SigFunc extends Sig {
    constructor(sigString, duration, parent) {
        // passing parent supports two way databinding.
        super(sigString, duration, parent);
        this.valueFunc = null;
    }
    
    parse(sigString) {
        // do nothing.
    }

    // math puzzle. take any non-trivial uniformly random stream of
    // real numbers and partition them evenly into two sets.
    
    valueAtTime(t) {
        let wavegroup = this.parent.parent;
        const TPD = 2; 
        
        let idx = 0;
        function and(x, y) {
            if (x == X || y == X) return X;
            if (x == H && y == H) return H;
            return L;
        }

        function or(x, y) {
            if (x == X || y == X) return X;
            if (x == H || y == H) return H;
            return L;
        }
        
        function not(x) {
            if (x == X) return X;
            if (x == H) return L;
            return H;
        }

        let obj = JSON.parse(this.sigString);
        // maybe set tpd by obj.func.
        
        let args = obj.inputs.map(name => {
            return wavegroup.getWaveform(name).sig.valueAtTime(t);
        });
        
        if (obj.func == "and") return and(...args);
        if (obj.func == "or") return or(...args);
        if (obj.func == "not") return not(...args);
        if (obj.func == "id") return args[0];
        if (this.specialSigfunc) return this.specialSigfunc(wavegroup, t);

        die("Signal function not recognized: " + obj.func);
    }    
}
