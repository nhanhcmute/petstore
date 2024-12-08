'use strict';
const { createHash } = require('crypto');

module.exports = (env) => {
  if (typeof env !== 'object' || env === null) {
    throw new Error('Input must be a valid object');
  }

  const hash = createHash('md5');
  hash.update(JSON.stringify(env));

  return hash.digest('hex');
};
