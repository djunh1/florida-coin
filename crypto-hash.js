const crypto = require('crypto');

const cryptoHash = (...inputs) => {
  //n args into an array
  const hash = crypto.createHash('sha256');
  hash.update(inputs.sort().join(' '));
  return hash.digest('hex');//hash result
};

module.exports = cryptoHash;
