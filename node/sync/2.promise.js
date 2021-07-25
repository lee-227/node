const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCbs = []
    this.onRejectedCbs = []
    const resolve = (val) => {
      if (val instanceof Promise) {
        val.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = val
        this.onFulfilledCbs.forEach((fn) => fn())
      }
    }
    const reject = (err) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = err
        this.onFulfilledCbs.forEach((fn) => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (val) => {
            throw val
          }
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            handelP2(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.value)
            handelP2(x, promise2, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === PENDING) {
        this.onFulfilledCbs.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              handelP2(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.onRejectedCbs.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.value)
              handelP2(x, promise2, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
  static resolve(val) {
    return new Promise((resolve, reject) => resolve(val))
  }
  static reject(val) {
    return new Promise((resolve, reject) => reject(val))
  }
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      let res = []
      let count = 0
      function getData(index, data) {
        res[index] = data
        if (++count === promises.length) {
          resolve(res)
        }
      }
      for (let index = 0; index < promises.length; index++) {
        const p = promises[index]
        if (isPromise(p)) {
          p.then((val) => getData(i, val)).catch(reject)
        } else {
          getData(i, p)
        }
      }
    })
  }
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let index = 0; index < promises.length; index++) {
        const p = promises[index]
        if (isPromise(p)) {
          p.then(resolve, reject)
        } else {
          resolve(p)
        }
      }
    })
  }
  static allSettled(promises) {
    return new Promise((resolve, reject) => {
      let res = []
      let count = 0
      function getData(index, data) {
        res[index] = data
        if (++count === promises.length) {
          resolve(res)
        }
      }
      for (let index = 0; index < promises.length; index++) {
        const p = promises[index]
        if (isPromise(p)) {
          p.then(
            (val) => getData(i, val),
            (err) => getData(i, err)
          )
        } else {
          getData(i, p)
        }
      }
    })
  }
  finally(cb) {
    return this.then(
      (data) => {
        return Promise.resolve(cb()).then(() => data)
      },
      (err) => {
        return Promise.resolve(cb()).then(() => {
          throw err
        })
      }
    )
  }
}
function isPromise(val) {
  return val && typeof val.then === 'function'
}
function handelP2(x, promise2, resolve, reject) {
  if (x === promise2) {
    throw 'error'
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            handelP2(y, promise2, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}
