import {err, log} from './err.js';
import {L, H, X} from './transition.js';
import {Waveform} from './waveform.js';
import {WaveGroup} from './wavegroup.js';
import {Mux2} from './mux2.js';

let mux2 = new Mux2(document.getElementById("mux-2"),  40);

mux2.nudgeLabel("out", 1.1, .14);
// mux2.nudgeLabel("in1", -.5, -.19);
// mux2.nudgeLabel("in0", -.5, -.19);
// mux2.nudgeLabel("sel", .4, .7);


new WaveGroup(document.getElementById("wavegroup1"));
