const EventEmitter = require('events')
const fs = require('fs')
class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super()
    this.path = path
    this.flags = options.flags || 'r'
    this.encoding = options.encoding || null
    this.autoClose = options.autoClose || true
    this.start = options.start || 0
    this.end = options.end || undefined
    this.highWaterMark = options.highWaterMark || 64 * 1024
    this.open()
    this.offset = this.start
    this.flowing = false
    this.on('newListener', (type) => {
      if (type !== 'data') return
      this.flowing = true
      this.read()
    })
  }
  resume() {
    if (!this.flowing) {
      this.flowing = true
      this.read()
    }
  }
  pause() {
    this.flowing = false
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.emit('error', err)
      }
      this.fd = fd
      this.emit('open', fd)
    })
  }
  read() {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this.read())
    }
    const buffer = Buffer.alloc(this.highWaterMark)
    let howMuchToRead = Math.min(this.highWaterMark, this.end - this.offset + 1)
    fs.read(this.fd, buffer, 0, howMuchToRead, this.offset, (err, bite) => {
      if (bite) {
        this.offset += bite
        this.emit('data', buffer.slice(0, bite))
        if (this.flowing) {
          this.read()
        }
      } else {
        this.emit('end')
        if (this.autoClose) {
          fs.close(this.fd, () => {
            this.emit('close')
          })
        }
      }
    })
  }
  pipe(ws) {
    this.on('data', (chunk) => {
      let flag = ws.write(chunk)
      if (!flag) {
        this.pause()
      }
    })
    ws.on('drain', () => {
      this.resume()
    })
  }
}
module.exports = ReadStream
