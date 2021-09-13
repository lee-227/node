class EventEmitter {
  constructor() {
    this._events = {}
  }
  on(eventName, cb) {
    if (!this._events) {
      this._events = Object.create(null)
    }
    if (eventName !== 'newListener') {
      this.emit('newListener', eventName)
    }
    if (this._events[eventName]) {
      this._events[eventName].push(cb)
    } else {
      this._events[eventName] = [cb]
    }
  }
  emit(eventName, ...args) {
    if (!this._events || !this._events[eventName]) return
    this._events[eventName].forEach((fn) => fn(...args))
  }
  off(eventName, cb) {
    if (!this._events || !this._events[eventName]) return
    this._events[eventName] = this._events[eventName].filter(
      (fn) => fn !== cb && fn.fn !== cb,
    )
  }
  once(eventName, cb) {
    let once = (...args) => {
      cb(...args)
      this.off(eventName, once)
    }
    once.fn = cb
    this.on(eventName, once)
  }
}

function DuDu() {}
// DuDu.prototype = Object.create(EventEmitter.prototype);
// DuDu.prototype.__proto__ = EventEmitter.prototype;
Object.setPrototypeOf(DuDu.prototype, EventEmitter.prototype)
let dudu = new DuDu()
dudu.on('吃饭了', (val) => {
  console.log('杜瑶智使劲吃' + val)
})
let fn = () => {
  console.log('杜瑶智使劲睡')
}
dudu.once('睡觉了', fn)
dudu.off('睡觉了', fn)
dudu.emit('吃饭了', '好吃的')
dudu.emit('睡觉了')
dudu.emit('吃饭了', '巨好吃的')
dudu.emit('睡觉了')
