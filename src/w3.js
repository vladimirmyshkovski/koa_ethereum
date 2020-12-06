const Web3 = require('web3');

let w3 = new Web3('ws://geth:8546');

console.log('w3', w3)

w3.setProvider(new Web3.providers.WebsocketProvider('ws://geth:8546'));

module.exports = w3