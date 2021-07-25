const fs = require('fs').promises
async function read() {
  let name = await fs.readFile('name.txt', 'utf8')
  let age = await fs.readFile(name, 'utf8')
  return age
}
//////////////////////////////////////////////////////////////////////
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg)
    var value = info.value
  } catch (error) {
    reject(error)
    return
  }
  if (info.done) {
    resolve(value)
  } else {
    Promise.resolve(value).then(_next, _throw)
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args)
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }
      _next(undefined)
    })
  }
}

function read() {
  return _read.apply(this, arguments)
}

function _read() {
  _read = _asyncToGenerator(function* () {
    let name = yield fs.readFile('name.txt', 'utf8')

    let age = yield fs.readFile(name, 'utf8')
    return age
  })
  return _read.apply(this, arguments)
}
