import {die, log} from './err.js';

export class Attributes {
    constructor(div) {
        this.div = div;
    }
    get(name) {
        let val = this.div.getAttribute(name);        
        if (val == null) die("could not find attribute: " + name);
        return val;
    }

    hasAttr(name) {
        return this.div.hasAttribute(name);
    }
    
    getAsNum(name) {
        let numString = this.get(name);
        let num = Number.parseFloat(numString);
        if (Number.isNaN(num)) die("Couldn't parse: " + numString + " as a number");
        return num;
    }
    
    set(name, val) {
        this.div.setAttribute(name, val);        
    }
}
