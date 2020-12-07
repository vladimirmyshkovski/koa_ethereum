const Joi = require('joi');
const web3 = require('w3');
const validate = require('middlewares/validate');

const ethereumTransactionsData = {};

async function getTransactionByNumber(transactionId) {
  if (typeof(ethereumTransactionsData[transactionId]) !== 'undefined') {
    return ethereumTransactionsData[transactionId];
  }
  ethereumTransactionsData[transactionId] = await web3.eth.getTransaction(transactionId);
  return ethereumTransactionsData[transactionId];
}

const handler = async (ctx) => {
  ctx.body = await getTransactionByNumber(ctx.params.id);
  ctx.status = 200;
};

module.exports.register = (router) => {
  router.get('/:id', handler);
};
