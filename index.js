const fs = require('fs');
const path = require('path');
const util = require('util');
const Crypto = require('./crypto');

const writeFilePromise = util.promisify(fs.writeFile);
const readFilePromise = util.promisify(fs.readFile);


class Json {
  constructor(file, opts) {
    this.contents = null;
    this.crypto = null;
    if (opts) {
      this.crypto = new Crypto(opts);
    }
    this.open(file);
  }
  encrypt(obj) {
    if (this.crypto) {
      return this.crypto.encrypt(JSON.stringify(obj));
    } else {
      return JSON.stringify(obj);
    }
  }

  decrypt(str) {
    if (this.crypto) {
      try {
        return JSON.parse(this.crypto.decrypt(str));
      } catch (e) {
        if (e.message.indexOf('bad decrypt') >= 0) {
          throw new Error('incorrect_key');
        }
        return null;
      }
    } else {
      try {
        return JSON.parse(str);
      } catch (e) {
        return null;
      }
    }
  }

  open(newFile) {
    if (typeof newFile === "string") {
      this.file = path.resolve(newFile);
      this.contents = null;
    }
  }

  async write(obj) {
    this.contents = null;
    return writeFilePromise(this.file, this.encrypt(obj));
  }

  writeSync(obj) {
    this.contents = null;
    fs.writeFileSync(this.file, this.encrypt(obj), { encoding: 'utf8' });
  }

  async read() {
    if (this.contents === null) {
      let data;
      try {
        data = await readFilePromise(this.file, 'utf8');
      } catch (e) {
        if (e.code === 'ENOENT') {
          return null;
        }
        throw e;
      }
      this.contents = this.decrypt(data);
    }
    return this.contents;
  }

  readSync() {
    if (this.contents === null) {
      try {
        const data = fs.readFileSync(this.file, 'utf8');
        this.contents = this.decrypt(data);
      } catch (e) {}
    }
    return this.contents;
  }

  unload() {
    this.contents = null;
  }
}


module.exports = Json;

