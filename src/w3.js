const Web3 = require('web3');

const w3 = new Web3(process.env.ETHEREUM_BASE_URL);

w3.setProvider(new Web3.providers.WebsocketProvider(process.env.ETHEREUM_BASE_URL));

module.exports = w3;
