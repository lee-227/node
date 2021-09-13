var buffer = Buffer.alloc(5)
var buf1 = Buffer.from('lee')
var buf2 = Buffer.from('du')
Buffer.prototype.copy = function (
  target,
  targetStart,
  sourceStart = 0,
  sourceEnd = this.length,
) {
  for (let i = sourceStart; i < sourceEnd; i++) {
    target[targetStart++] = this[i]
  }
  return target
}
buf1.copy(buffer, 0, 0, 3)
buf2.copy(buffer, 3, 0, 2)

console.log(buffer.toString())

Buffer.concat = function (
  bufArr,
  length = bufArr.reduce((a, b) => (a += b.length), 0),
) {
  let buffer = Buffer.alloc(length)
  let offset = 0
  bufArr.forEach((buf) => {
    buf.copy(buffer, offset)
    offset += buf.length
  })
  return buffer.slice(0, offset)
}
var buffer = Buffer.concat([buf1, buf2])
console.log(buffer.toString())

console.log(Buffer.isBuffer(buffer))

Buffer.split = function (dep, buffer) {
  let len = Buffer.from(dep).length
  let offset = 0
  let index = 0
  let res = []
  while ((offset = buffer.indexOf(dep, index)) !== -1) {
    console.log(
      buffer.indexOf(dep, index),
      buffer.slice(index, offset),
      index,
      offset,
    )
    res.push(buffer.slice(index, offset))
    index = offset + len
  }
  res.push(buffer.slice(index))
  return res
}
let buf = Buffer.from('lai吃馒头，吃面条，我吃所有吃')
let bufArr = Buffer.split('吃', buf)
bufArr.forEach((i) => console.log(i.toString()))
