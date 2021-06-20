import {err, log} from './err.js';
import {L, H, X} from './transition.js';
import {Waveform} from './waveform.js';
import {WaveGroup} from './wavegroup.js';
import {Mux2} from './mux2.js';

let mux2 = new Mux2(40);
mux2.nudgeLabel("outputQ", 1.1, .14);
mux2.nudgeLabel("inputD", -.5, -.19);
mux2.nudgeLabel("inputQ", -.5, -.19);
mux2.nudgeLabel("inputG", .4, .7);


new WaveGroup(document.getElementById("wavegroup1"));
