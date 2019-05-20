const crypto = require('crypto');

const IV_LENGTH = 16; // For AES, this is always 16


class Crypto {
  constructor(opts) {
    opts = opts || {};
    if (!opts.key) {
      throw new Error('No crypto key has been given.');
    }
    const hash = crypto.createHmac('sha256', opts.key).digest('hex');
    this.key = hash.slice(0, 32);
    this.method = opts.method || 'aes-256-cbc';
  }
  encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const decryptedText = decrypted.toString();
    return decryptedText;
  }
}


module.exports = Crypto;