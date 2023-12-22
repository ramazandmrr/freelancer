const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('ff3f65cbfd38c967dc4cf6a08cda687e8cec24ba5d5badf691fa52d379c3d9f9');
const myWalletAddress = myKey.getPublic('hex');

let bestCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
bestCoin.addTransaction(tx1);

console.log('\n Starting the miner...');
bestCoin.minePendingTransactions(myWalletAddress);

console.log('\nBalance of xavier is', bestCoin.getBalanceOfAddress(myWalletAddress));

bestCoin.chain[1].transactions[0].amount = 1;

console.log('Is chain valid?', bestCoin.isChainValid());

