import * as SVG from '@svgdotjs/svg.js';
import {die, log} from './err.js';
import {Poly} from './poly.js';
import {Mux2} from './mux2.js';
import {And2} from './and2.js';
import {Wire} from './wire.js';
import {Attributes} from './attrs.js';

export class Schematic {
    // A manager for devices.  the Wavegroup and Schematic will share
    // a event channel, where Wavegroup is the controller.
    
    constructor(div) {
        let attrs = new Attributes(div);
        this.div = div;
        let w = attrs.get("w");
        let h = attrs.get("h");
        this.ctx = SVG.SVG().addTo(div).size(w, h);
        this.devices = [];
    }

    addDevice(name, device) {
        if (!this.deviceExistsP(name)) {
            this.devices[name] = device;
        } else {
            die("device already exists: " + name);
        }
    }
    
    addMux(name, x, y) {
        let mux = new Mux2(this.ctx, document.getElementById(name), 30, x, y);
        this.addDevice(name, mux);
        return mux;
    }

    addAnd2(divName, x, y) {
        let and2 = new And2(this.ctx, document.getElementById(divName), 40, x, y);
        this.addDevice(divName, and2);
        return and2;
    }
    
    addWire(name, x, y) {
        let wire = new Wire(this.ctx, x, y);
        wire.done();
        this.addDevice(name, wire);
        return wire;
    }

    deviceExistsP(name) {
        return this.devices[name] != null;
    }

    update(sigmap) {
        for (let device of Object.values(this.devices)) {
            device.update(sigmap);
        }
    }    
}
