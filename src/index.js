import {err, log} from './err.js';
import {L, H, X} from './transition.js';
import {Waveform} from './waveform.js';
import {WaveGroup} from './wavegroup.js';
import {Mux2} from './mux2.js';
import {Schematic} from './schem.js';
import {LabBench} from './labbench.js';

function aMuxWarmUp() {
    let div = document.getElementById("bench1");
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
    let bench = new LabBench(div);    
    let schem = bench.schematic;
    let and2 = schem.addAnd2("and2-slide", 320, 30);
    and2.nudgeLabel("A", -1.0, -.27);
    and2.nudgeLabel("B", -1.0, -.27);
    and2.nudgeLabel("C", 1.3, -.27);
    
}
slideATransition();

function latch() {
    let div = document.getElementById("bench3");
    let bench = new LabBench(div);    
    let mux2 = bench.schematic.addMux("latch-mux", 350, 50);
    
    mux2.nudgeLabel("Q", 1.3, .37);
    mux2.nudgeLabel("★", -1.9, -.37);
    mux2.nudgeLabel("D", -1.8, -.37);
    mux2.nudgeLabel("G", -.1, .7);

    let p = [410, 110]; // TODO get this value from mux terminal.
    let wire1 = bench.schematic.addWire("wire1", p[0], p[1]);
    wire1.rt(50).up(75+10).lt(140).dn(45+10).done();
    wire1.init().dashed().animate();

    // TODO this could be made nicer by establishing a "connection" between
    // terminals and wires. maybe later.
    mux2.getTerm("out").onChangeValue(function(newval) {
        // TODO Mux.getTerm should probably be a device method and
        // should definitely use the user supplied terminal name
        wire1.setValue(newval);
    });

    let MUX_TPD = 2;
    let MUX_TCD = 1;
    
    bench.specialSigfunc("Q", function(wavegroup, t) {
        let Q = wavegroup.getWaveform("Q");
        let D = wavegroup.getWaveform("D");
        let G = wavegroup.getWaveform("G");
        
        let clkEdge = G.transitions[1].t;
        let setupTime = 2 * MUX_TPD;
        let observedSetupTime = clkEdge - D.transitions[2].adjTime();
        let setupTimeMet = observedSetupTime >= setupTime;

        let holdTime = MUX_TPD;
        let observedHoldTime = D.transitions[3].adjTime() - clkEdge;
        let holdTimeMet = observedHoldTime >= holdTime;
        
        if (setupTimeMet && holdTimeMet) {
            if (t > (D.transitions[2].adjTime() + MUX_TPD)) {
                let value = D.sig.valueAtTime(20);
                return value;
            }
        } else {
            let valG = G.sig.valueAtTime(t);
            if (valG == H) {
                return D.sig.valueAtTime(t - MUX_TPD);
            } else {
                return D.sig.valueAtTime(2); // noise
            }
        }
        return X;
    });
    
}
latch();


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
