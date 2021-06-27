import {die, log} from './err.js';

export class Device {
    constructor(terminals, attrs) {
        this.terminals = terminals;

        // setup mapping from (user defined names -> device terminal name)
        // for example:

        // <div id="and2-slide" class="and2" in0="A" in1="B" out="C"></div>
        //                                   |    |        
        //                                   |    | user defined name
        //              device terminal name |
        
        this.userTermNames = [];
        Object.keys(this.terminals).forEach(termName => {
            this.userTermNames[attrs.get(termName)] = this.terminals[termName];
        });
    }

    termFromUserDefName(userDefName) {
        // need to keep a mapping from user defined name to terminal keys.
        return this.userTermNames[userDefName];
    }
    
    nudgeLabel(userDefName, dx, dy) {
        // allow users adjust terminal label positions.
        this.termFromUserDefName(userDefName).nudgeLabel(dx, dy);
    }

    update(sigmap) {        
        for (let term of Object.values(this.terminals)) {            
            let val = sigmap[term.name];
            if (val && val.ok) {
                term.updateValue(val.val);
            }
        }
    }

    
    // this should be a method an interface called Device.
    // getConnectionPx(termName) {
    //     // get the absolute pixel position of a terminal give a
    //     // terminal name
    //     let term = this.terminals[termName];
    //     let ps = term.getPoints();
    //     if (term) {
    //         if (termName == "out") {
    //             return ps[1];
    //         }
    //         die("need to handle other terminal names");
    //     } else {
    //         die("Could not find terminal: " + termName);
    //     }
    // }
}
