var assert = require('assert');
var ut = require('./lib/rskUtil');

describe('Btc transactions', function(){
    describe('Empty transaction', function(){
        it('should return -1 when btc transaction is empty', function() {
            assert.equal(ut.getRskAddress(''), -1);
        });
    });

    describe('Bad formatted transaction', function(){
        it('should return -2 when btc transaction is empty', function() {
            assert.equal(ut.getRskAddress('a'), -2);
        });
        it('should return -2 when btc transaction is empty', function() {
            assert.equal(ut.getRskAddress('xNrw/GoCnbppfYoEENuXw7pxiKepv3E8c+mC+bcZYzo='), -2);
        });
    });

    describe('transaction', function(){
        it('should return -4 when from is not p2pkh address', function() {
            assert.equal(ut.getRskAddress('0200000000010159a187f05902b8039c5bc3cb22079e17da49f1f01867e619b3e4ecfa2159c9350200000017160014976f33aa31894a26356abd6a98535f25a1a9ef3cffffffff02704231000000000017a91456cb0461fff3f22a73df0e5b8bff8efb86e9758e874d0d00000000000017a914a558d2675b74227867f32c4be0e302c7a0d51fc38702473044022001890c1ab92c520d7acda5364d474ce27f8748a6129c08e167f690faffb981d202200515ce8ed396b7287993369d56eeecac9704c9f100f6f6296f260a20e3f8bf83012103bf1817f7420c6b33143ea0b6bccd6b365faa189f7a7fbd54f1673300d3f1992d00000000'), -4);
        });        
    });    
})