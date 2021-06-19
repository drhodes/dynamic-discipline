import {err, log} from './err.js';
import {L, H, X} from './transition.js';
import {Waveform} from './waveform.js';
import {Mux2} from './mux2.js';

let mux2 = new Mux2(40);
mux2.nudgeLabel("outputQ", 1.1, .14);
mux2.nudgeLabel("inputD", -.5, -.19);
mux2.nudgeLabel("inputQ", -.5, -.19);
mux2.nudgeLabel("inputG", .4, .7);

// new Waveform(document.getElementById("wave-id1"),
//              [[0, H], [10, H], [27, L], [30, H], [33, L], [50, H]],
//              50, {});

// new Waveform(document.getElementById("wave-id2"),
//              [ [0, L],  // start low at time 0.
//                [10, L], // L from 0  -> 10
//                [12, H], // H from 10 -> 12
//                [13, L], // L from 12 -> 13
//                [15, H], // H from 13 -> 15 
//                [18, L],
//                [19, H],
//                [22, L],
//                [500, H] ],
//              50, {});

new Waveform(document.getElementById("wave-id-step1q"), 50, {});
new Waveform(document.getElementById("wave-id-step1d"), 50, {});
new Waveform(document.getElementById("wave-id-step1g"), 50, {});
