'use strict'
var argh = require('argh').argv;
var colors = require('colors');
var rskUtil = require('./lib/rskUtil');

var getRskAddressOperation = function(argh){	
	let rawTx = argh.argv && argh.argv[0];
	let result = rskUtil.getRskAddress(rawTx);	

	switch (result) {
		case -1:
			console.error('it must be specified a btc transaction'.red);	
			break;
		case -2:
			console.error('wrong formated tx'.red);	
			break;
		case -3:
			console.error('the tx must have at least one input.'.red);
			break;
		case -4:
			console.error('from address have to be P2PKH'.red);
			break;
		default:
			console.log("RSK derived address: \n".yellow + result);
			break;
	}

	return result;
}

var getAmountOperation = function(argh){	
	let rawTx = argh.argv && argh.argv[0];
	let result = rskUtil.getRskAddress(rawTx);	

	switch (result) {
		case -1:
			console.error('it must be specified a btc transaction'.red);	
			break;
		case -2:
			console.error('wrong formated tx'.red);	
			break;
		case -3:
			console.error('the tx must have at least one input.'.red);
			break;
		case -4:
			console.error('from address have to be P2PKH'.red);
			break;
		default:
			console.log("Amount: ".yellow  + result + ' RBTC'.yellow);
			break;
	}

	return result;
}

var printUsage = function() {
	var w = process.stdout.write.bind(process.stdout);
	w('\n');
	w('UtilityTool (UT) - Utility for the BTC <=> RSK 2WP\n');
	w('==============================================\n\n');
	w('Usage:\n');
	w('./ut.js [options] [command]\n\n');
	w('Available commands:\n');
	w('-a [raw-btc-transactin]\t\t\t\t Get RSK derived address from btc raw transaction to the bridge\n');
	w('-v [raw-btc-transactin]\t\t\t\t Get amount from btc raw transaction to the bridge\n');
	w('\n');
};

var unknownOperation = function() {
	process.stdout.write('Unknown command, issue -h or --help for help\n');
}

var OPERATIONS = {
	'a': getRskAddressOperation,	
	'v': getAmountOperation,	
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