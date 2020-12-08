const web3 = require('w3');
const client = require('cache');
const logger = require('logger');
const emitter = require('socket.io-emitter')(client);

exports.pendingTransactions = web3.eth.subscribe('pendingTransactions', (error, result) => {
  if (error) {
    logger.error(error);
  }
  client.lpush('transactions', result);
  client.ltrim('transactions', 0, 99);
  client.lrange('transactions', 0, -1, (err, reply) => {
    if (err) {
      logger.error(err);
    }
    emitter.emit('transactions', reply);
  });
});

exports.getTransactionByNumber = async (transactionId) => {
  const key = `transaction_hash_${transactionId}`;
  let value = null;
  client.get(key, (err, reply) => {
    if (reply) {
      value = JSON.parse(reply);
    }
  });
  if (!value) {
    value = await web3.eth.getTransaction(transactionId);
    client.setex(key, 60 * 60, JSON.stringify(value));
  }
  return value;
};

exports.getBlockByNumber = async (numberOfBLock) => {
  const key = `block_number_${numberOfBLock}`;
  let value = null;
  client.get(key, (err, reply) => {
    if (reply) {
      value = JSON.parse(reply);
    }
  });
  if (!value) {
    value = await web3.eth.getBlock(numberOfBLock);
    client.setex(key, 60 * 60, JSON.stringify(value));
  }
  return value;
};

exports.getAddressTransactions = async (address, namespace) => {
  const currentBlock = await web3.eth.getBlockNumber();
  let transactionCount = await web3.eth.getTransactionCount(address, currentBlock);
  for (let i = currentBlock; i >= 0 && (transactionCount > 0); i -= 1) {
    try {
      const block = await web3.eth.getBlock(i, true); // eslint-disable-line no-await-in-loop
      if (block && block.transactions) {
        // eslint-disable-next-line no-loop-func
        block.transactions.forEach((transaction) => {
          namespace.emit('transactions', JSON.stringify(transaction));
          transactionCount -= 1;
        });
      }
    } catch (e) {
      logger.error(`Error on web3.service.getAccountTransactions in block ${i}`, e);
    }
  }
};
