var fs     = require('fs');
var assert = require('assert');
var JsonDB = require('..');

describe('Basic API', function () {

  var file = './test.json';

  afterEach(function (done) {
    fs.unlink(file, done)
  })

  beforeEach(function () {
    this.db = new JsonDB(file);
  })

  it('write/read async', function (done) {
    var db = this.db;
    db.write('test', function (err) {
      assert.ok(!err);
      db.read(function (err, val) {
        assert.ok(!err);
        assert.equal(val, 'test');
        db.write({ x: [1,2,3], y: { a: 1, b: 2, c: 3 }, z: 'xyz' }, function (err) {
          assert.ok(!err);
          db.read(function (err, val) {
            assert.ok(!err);
            assert.equal(typeof val, 'object');
            assert.deepEqual(val.x, [1,2,3]);
            assert.deepEqual(val.y, { a: 1, b: 2, c: 3 });
            assert.equal(val.z, 'xyz');
            done();
          })
        })
      })
    })
  })

  it('write/read sync', function () {
    var db = this.db;
    
    db.writeSync('test');
    var val = db.readSync()
    assert.equal(val, 'test');
    
    db.writeSync({ x: [1,2,3], y: { a: 1, b: 2, c: 3 }, z: 'xyz' })
    var val = db.readSync()
    assert.equal(typeof val, 'object');
    assert.deepEqual(val.x, [1,2,3]);
    assert.deepEqual(val.y, { a: 1, b: 2, c: 3 });
    assert.equal(val.z, 'xyz');
  })

})
