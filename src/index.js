import {err, log} from './err.js';
import {L, H, X} from './transition.js';
import {Waveform} from './waveform.js';
import {WaveGroup} from './wavegroup.js';
import {Mux2} from './mux2.js';
import {Schematic} from './schem.js';
import {LabBench} from './labbench.js';

// let mux2 = new Mux2(document.getElementById("mux-2"),  30);

function aMuxWarmUp() {
    let div = document.getElementById("bench1");
    console.log(div);
    let bench = new LabBench(div);    
    let schem = bench.schematic;
    let mux2 = schem.addMux("mux-2", 350, 50);
    mux2.nudgeLabel("out", 1.3, -.37);
    mux2.nudgeLabel("in0", -1.8, -.37);
    mux2.nudgeLabel("in1", -1.8, -.37);
    mux2.nudgeLabel("sel", -.1, .7);
}
aMuxWarmUp();


function slideATransition() {
    let div = document.getElementById("bench2");
    console.log(div);
    let bench = new LabBench(div);    
    let schem = bench.schematic;
    let and2 = schem.addAnd2("and2-slide", 350, 50);
}
slideATransition();

function BuildFeedback1() {
    // this works, but the wires are a bit tedius, a better way?
    let schem = new Schematic(document.getElementById("schem1"));
    let mux2 = schem.addMux("mux-2", 350, 50);

    let p = mux2.getConnectionPx("out");
    console.log(p);

    let wire1 = schem.addWire("wire1", p[0], p[1]);
    // let wire1 = schem.addWire("wire1", p[0], p[1]);
    wire1.rt(50).up(75+10).lt(140).dn(45+10).dashed().done();
    wire1.init().dashed().animate();

    new WaveGroup(document.getElementById("wavegroup1"));
}
