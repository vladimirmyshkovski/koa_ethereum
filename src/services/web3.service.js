const web3 = require('w3');
const client = require('cache');
const logger = require('logger');
const emitter = require('socket.io-emitter')(client);


const pendingTransactions = web3.eth.subscribe('pendingTransactions', function(error, result) {
  let length = 0;
  if (error) {
    logger.error(error);
  }
  client.lpush('transactions', result)
  client.ltrim('transactions', 0, 99)
  client.lrange('transactions', 0, -1, function(error, reply) {
    if (error) {
      logger.error(error);
    }
    emitter.emit('transactions', reply)
  })
});

module.exports = pendingTransactions;