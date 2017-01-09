var fs = require('fs');
var path = require('path');
var Crypto = require('./crypto');

function Json(file, opts) {
  this.contents = null;
  this.crypto = null;
  if (opts) {
    this.crypto = new Crypto(opts);
  }
  this.open(file);
}

Json.prototype.encrypt = function (obj) {
  if (this.crypto) {
    return this.crypto.encrypt(JSON.stringify(obj));
  } else {
    return JSON.stringify(obj);
  }
}

Json.prototype.decrypt = function (str) {
  if (this.crypto) {
    try {
      return JSON.parse(this.crypto.decrypt(str));
    } catch (e) {
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

Json.prototype.open = function (newFile) {
  if (typeof newFile === "string") {
    this.file = path.resolve(newFile);
    this.contents = null;
  }
}

Json.prototype.write = function (obj, cb) {
  cb = cb || function(){};
  this.contents = null;
  fs.writeFile(this.file, this.encrypt(obj), 0, 'binary', function (err, written, string) {
    if (err) {
      cb(err, false);
    } else if (written <= 0) {
      cb({ error: "no_data_written" }, false);
    } else {
      cb(null, true);
    }
  })
}

Json.prototype.writeSync = function (obj) {
  this.contents = null;
  fs.writeFileSync(this.file, this.encrypt(obj), null, 'binary');
}

Json.prototype.read = function (cb) {
  cb = cb || function(){};
  var self = this;
  if (this.contents !== null) {
    return setImmediate(function () {
      cb(null, self.contents);
    })
  }
  fs.readFile(this.file, { encoding: null }, function (err, data) {
    if (err) {
      return cb(err, null);
    }
    self.contents = self.decrypt(data);
    cb(null, self.contents);
  })
}

Json.prototype.readSync = function () {
  if (this.contents !== null) {
    return this.contents;
  }
  try {
    var data = fs.readFileSync(this.file, { encoding: null });
    this.contents = this.decrypt(data);
    return this.contents;
  } catch (e) {
    return null;
  }
}

Json.prototype.unload = function () {
  this.contents = null;
}

module.exports = Json;

