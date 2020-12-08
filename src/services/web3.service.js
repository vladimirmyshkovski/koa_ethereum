const web3 = require('w3');
const client = require('cache');
const logger = require('logger');
const emitter = require('socket.io-emitter')(client);


exports.pendingTransactions = web3.eth.subscribe('pendingTransactions', function(error, result) {
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
    emitter.emit('transactions', reply);
  })
});

exports.getTransactionByNumber = async (transactionId) => {
  const key = `transaction_hash_${transactionId}`;
  let value = null;
  client.get(key, function(err, reply) {
    if (reply) {
      value = JSON.parse(reply);
    }
  });
  if (!value) {
    value = await web3.eth.getTransaction(transactionId);
    client.setex(key, 60*60, JSON.stringify(value));
  }
  return value;
};

exports.getBlockByNumber = async (numberOfBLock) => {
  const key = `block_number_${numberOfBLock}`;
  let value = null;
  client.get(key, function(err, reply) {
    if (reply) {
      value = JSON.parse(reply);
    }
  });
  if (!value) {
    value = await web3.eth.getBlock(numberOfBLock);
    client.setex(key, 60*60, JSON.stringify(value));
  }
  return value;
};
