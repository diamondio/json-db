
var crypto = require('crypto');

function Crypto (opts) {
  opts = opts || {};
  if (!opts.key) {
    throw new Error('No crypto key has been given.');
  }
  this.key = opts.key;
  this.method = opts.method || 'aes256';
}

Crypto.prototype.encrypt = function (message) {
  var cipher = crypto.createCipher(this.method, this.key);
  var encrypted = cipher.update(message, 'utf8', 'base64') + cipher.final('base64');
  return new Buffer(encrypted, 'base64');
}

Crypto.prototype.decrypt = function (encrypted) {
  try {
    var decipher = crypto.createDecipher(this.method, this.key);
    var decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8') + decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return null;
  }
}


module.exports = Crypto;