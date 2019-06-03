'use strict'

var eu = require('ethereumjs-util');
var bitcoin = require('bitcoinjs-lib');
var secp256k1 = require('secp256k1');
var math = require('mathjs');
var colors = require('colors');
var Web3 = require('web3');

var validateTx = function(rawTx) { 
    let tx;   
	if (!rawTx.trim()) {
		return -1;
	}

	try{
		tx = bitcoin.Transaction.fromHex(rawTx);
	}
	catch(error){        
		return -2;
	}

	if (tx.ins.length == 0 && tx.ins[0].script != nul){	
		return -3;
	}

	var scriptChunks = bitcoin.script.toASM(tx.ins[0].script);

	if ((scriptChunks != null && scriptChunks.split(' ').length < 2 )) {		
		return -4;
    }
    
    return 0;
}

var getRskAddress = function(rawTx) {    
    let validatedTxCode = validateTx(rawTx);    
    if (validatedTxCode != 0){        
        return validatedTxCode;
    }
    
    let tx = bitcoin.Transaction.fromHex(rawTx);
    let scriptChunks = bitcoin.script.toASM(tx.ins[0].script);
    		
    var pubKey = scriptChunks.split(' ')[1];
    var uncompressed_public_key_hex = secp256k1.publicKeyConvert(new Buffer.from(pubKey, 'hex'), false).toString('hex');
    
    var upk_buf = new Buffer.from(uncompressed_public_key_hex, 'hex');
    var addr_buf = eu.pubToAddress(upk_buf.slice(1,65));

	return addr_buf.toString('hex');

	//console.log("RSK derived address: \n".yellow + addr);
	//console.log("Amount: ".yellow  + (tx.outs[0].value / math.pow(10,8)) + ' RBTC'.yellow);
};

var getAmount = function(rawTx) {    
    let validatedTxCode = validateTx(rawTx);    
    if (validatedTxCode != 0){        
        return validatedTxCode;
    }
    
    let tx = bitcoin.Transaction.fromHex(rawTx);
    let scriptChunks = bitcoin.script.toASM(tx.ins[0].script);
    		
    var pubKey = scriptChunks.split(' ')[1];
    var uncompressed_public_key_hex = secp256k1.publicKeyConvert(new Buffer.from(pubKey, 'hex'), false).toString('hex');
    
    var upk_buf = new Buffer.from(uncompressed_public_key_hex, 'hex');
    var addr_buf = eu.pubToAddress(upk_buf.slice(1,65));

	return tx.outs[0].value / math.pow(10,8);

	//console.log("RSK derived address: \n".yellow + addr);
	//console.log("Amount: ".yellow  + (tx.outs[0].value / math.pow(10,8)) + ' RBTC'.yellow);
};

var getFederationAddress = async function(){    
    let web3Client = new Web3(new Web3.providers.HttpProvider('https://public-node.rsk.co'));
    let bridgeAbi = '[{ "name": "getFederationAddress", "type": "function", "constant": true, "inputs": [], "outputs": [{ "name": "", "type": "string" }] }]';
    let bridgeAddress = "0x0000000000000000000000000000000001000006";
    let bridgeContract = new web3Client.eth.Contract(JSON.parse(bridgeAbi),bridgeAddress);            
    return bridgeContract.methods.getFederationAddress().call();        
}

module.exports = {
    getRskAddress,
    getAmount,
    getFederationAddress
}