import * as assert from 'assert';
import {Sig} from '../src/sig.js';
import {L, H, X} from '../src/transition.js';

describe('sig', function() {
    describe('new Sig()', function() {
        it('should parse single transition correctly', function() {
            let sig = new Sig("L 10");
            assert.equal(sig.transitions[0].t, 10);
            assert.equal(sig.transitions[0].value, L);
            
        });
        
        it('should parse two transitions correctly', function() {
            let sig = new Sig("L 10 X 20");
            assert.equal(sig.transitions[0].value, L);
            assert.equal(sig.transitions[0].t, 10);
            
            assert.equal(sig.transitions[1].value, X);
            assert.equal(sig.transitions[1].t, 20);
            
        });

    });
});
