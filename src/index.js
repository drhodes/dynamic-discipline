import {err, log} from './err.js';
import {L, H, X} from './transition.js';
import {Waveform} from './waveform.js';
import {WaveGroup} from './wavegroup.js';
import {Mux2} from './mux2.js';
import {Schematic} from './schem.js';
import {LabBench} from './labbench.js';

function aMuxWarmUp() {
    let div = document.getElementById("bench1");
    console.log(div);
    let bench = new LabBench(div);    
    let schem = bench.schematic;
    let mux2 = schem.addMux("mux-2", 350, 50);
    mux2.nudgeLabel("Q", 1.3, -.37);
    mux2.nudgeLabel("D0", -1.8, -.37);
    mux2.nudgeLabel("D1", -1.8, -.37);
    mux2.nudgeLabel("S", -.1, .7);
}
aMuxWarmUp();

function slideATransition() {
    let div = document.getElementById("bench2");
    console.log(div);
    let bench = new LabBench(div);    
    let schem = bench.schematic;
    let and2 = schem.addAnd2("and2-slide", 320, 50);
    and2.nudgeLabel("A", -1.0, -.27);
    and2.nudgeLabel("B", -1.0, -.27);
    and2.nudgeLabel("C", 1.3, -.27);
    
}
slideATransition();

// function BuildFeedback1() {
//     // this works, but the wires are a bit tedius, a better way?
//     let schem = new Schematic(document.getElementById("schem1"));
//     let mux2 = schem.addMux("mux-2", 350, 50);

//     let p = mux2.getConnectionPx("S");
//     console.log(p);

//     let wire1 = schem.addWire("wire1", p[0], p[1]);
//     // let wire1 = schem.addWire("wire1", p[0], p[1]);
//     wire1.rt(50).up(75+10).lt(140).dn(45+10).dashed().done();
//     wire1.init().dashed().animate();

//     new WaveGroup(document.getElementById("wavegroup1"));
// }
