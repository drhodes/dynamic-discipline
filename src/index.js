import {err, log} from './err.js';
import {L, H, X} from './transition.js';
import {Waveform} from './waveform.js';
import {WaveGroup} from './wavegroup.js';
import {Mux2} from './mux2.js';
import {Schematic} from './schem.js';

// let mux2 = new Mux2(document.getElementById("mux-2"),  30);


function aMuxWarmUp() {
    let schem = new Schematic(document.getElementById("schem1"));
    let mux2 = schem.addMux("mux-2", 350, 50);
    mux2.nudgeLabel("out", 1.3, -.27);
    mux2.nudgeLabel("in0", -1.5, -.27);
    mux2.nudgeLabel("in1", -1.5, -.27);
    mux2.nudgeLabel("sel", 0, .7);

    new WaveGroup(document.getElementById("wavegroup1"));
}
aMuxWarmUp();


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
