const web3 = require('web3');

web3 = new Web3();

const eventProvider = new Web3.providers.WebsocketProvider('ws://localhost:7545');

web3.setProvider(eventProvider);

module.exports = web3;
