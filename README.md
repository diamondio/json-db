# Simple JSON DB

#### Install (via npm)

```bash
npm install --save @diam/json-db
```

### Usage

Simply writes json to a file.

```js
var db = new JsonDB('./file.json');

db.write({ message: 'whatever you want' }, function (err) {
	db.read(function (err, val) {
		// val = { message: 'whatever you want' }
	})
})
```

It can also be done synchronously, like so:

```js
var db = new JsonDB('./file.json');

db.writeSync({ message: 'whatever you want' })
var val = db.readSync()
// val = { message: 'whatever you want' }
```


Contributions welcome!

### Credits
This library was initially made by the awesome team of engineers at [Diamond](https://diamond.io).

If you haven't already, make sure you install Diamond!
