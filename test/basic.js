const fs     = require('fs');
const assert = require('assert');
const JsonDB = require('..');

describe('Basic API', function () {

  const file = './test.json';

  it('write/read async', async function () {
    const db = new JsonDB(file);
    let val;
    await db.write('test');
    val = await db.read();
    assert.equal(val, 'test');
    await db.write({ x: [1,2,3], y: { a: 1, b: 2, c: 3 }, z: 'xyz' });
    val = await db.read();
    assert.equal(typeof val, 'object');
    assert.deepEqual(val.x, [1,2,3]);
    assert.deepEqual(val.y, { a: 1, b: 2, c: 3 });
    assert.equal(val.z, 'xyz');
    fs.unlinkSync(file);
  })

  it('write to new file', async function () {
    const db = new JsonDB('./new.json');
    let val;
    val = await db.read();
    assert.equal(val, null);
    await db.write({ x: 1 });
    val = await db.read();
    assert.deepEqual(val.x, 1);
    fs.unlinkSync('./new.json');
  })

  it('write/read encrypted', async function () {
    const db = new JsonDB(file, { key: 'secret' });
    let val;
    await db.write('test');
    val = await db.read();
    assert.equal(val, 'test');
    await db.write({ x: [1,2,3], y: { a: 1, b: 2, c: 3 }, z: 'xyz' });
    val = await db.read();
    assert.equal(typeof val, 'object');
    assert.deepEqual(val.x, [1,2,3]);
    assert.deepEqual(val.y, { a: 1, b: 2, c: 3 });
    assert.equal(val.z, 'xyz');
    fs.unlinkSync(file);
  })

  it('will fail if password incorrect', async function () {
    const db1 = new JsonDB(file, { key: 'secret' });
    await db1.write('test');
    const db2 = new JsonDB(file, { key: 'secret' });
    const val1 = await db2.read();
    assert.equal(val1, 'test');
    const db3 = new JsonDB(file, { key: 'wrong' });
    try {
      await db3.read();
      throw new Error('should have thrown');
    } catch (e) {
      assert.equal(e.message, 'incorrect_key');
    }
    fs.unlinkSync(file);
  })

  it('write/read sync', function () {
    const db = new JsonDB(file);
    let val;

    db.writeSync('test');
    val = db.readSync()
    assert.equal(val, 'test');
    
    db.writeSync({ x: [1,2,3], y: { a: 1, b: 2, c: 3 }, z: 'xyz' })
    val = db.readSync()
    assert.equal(typeof val, 'object');
    assert.deepEqual(val.x, [1,2,3]);
    assert.deepEqual(val.y, { a: 1, b: 2, c: 3 });
    assert.equal(val.z, 'xyz');
    fs.unlinkSync(file);
  })

})
