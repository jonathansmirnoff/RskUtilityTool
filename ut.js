'use strict'
var eu = require('ethereumjs-util');
var bitcoin = require('bitcoinjs-lib');
var secp256k1 = require('secp256k1');
var math = require('mathjs');
var argh = require('argh').argv;
var colors = require('colors');

var getRskAddress = function(argh) {
	var rawTx = argh.argv && argh.argv[0];
	if (rawTx == null) {
		console.error('Must specify a btc transaction');
		return;
	}

	var tx = bitcoin.Transaction.fromHex(rawTx);

	if (tx.ins.length == 0){
		console.error('the tx must have unless one input.');
		return;
	}

	var scriptChunks = bitcoin.script.toASM(tx.ins[0].script);

	if ((tx.ins[0].script == null) || 
		(tx.ins[0].script == null) ||
		(scriptChunks == null || (scriptChunks != null && scriptChunks.split(' ').length < 2 ))) {
		console.error('from address have to be P2PKH');
		return;
	}

	console.log("");
    		
    var pubKey = scriptChunks.split(' ')[1];
    var uncompressed_public_key_hex = secp256k1.publicKeyConvert(new Buffer.from(pubKey, 'hex'), false).toString('hex');

    //console.log("Public key: \n" + pubKey);
    //console.log("Uncompressed public key: \n" + secp256k1.publicKeyConvert(new Buffer(pubKey, 'hex'), false).toString('hex'));

    var upk_buf = new Buffer.from(uncompressed_public_key_hex, 'hex');
    var addr_buf = eu.pubToAddress(upk_buf.slice(1,65));

	var addr = addr_buf.toString('hex');

	console.log("RSK derived address: \n".yellow + addr);
	console.log("Amount: ".yellow  + (tx.outs[0].value / math.pow(10,8)) + ' RBTC'.yellow);
};

var printUsage = function() {
	var w = process.stdout.write.bind(process.stdout);
	w('\n');
	w('UtilityTool (UT) - Utility for the BTC <=> RSK 2WP\n');
	w('==============================================\n\n');
	w('Usage:\n');
	w('./tt.js [options] [command]\n\n');
	w('Available commands:\n');
	w('-a [raw-btc-transactin]\t\t\t\t Get RSK derived address from btc raw transaction to the bridge\n');
	w('\n');
};

var unknownOperation = function() {
	process.stdout.write('Unknown command, issue -h or --help for help\n');
}

var OPERATIONS = {
    'a': getRskAddress,	
	'help': printUsage
};

// Execute first op passing arguments in
var opCode = Object.keys(argh).find(key => OPERATIONS[key] != null);
if (opCode) {
    var ready = Promise.resolve();
	ready.then(() => OPERATIONS[opCode](argh));
} else {
	unknownOperation();
}