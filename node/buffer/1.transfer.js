// 0.1+0.2!==0.3
// 小数转二进制
// 0.1*2 = 0.2 0
// 0.2*2 = 0.4 0
// 0.4*2 = 0.8 0
// 0.8*2 = 1.6 1
// 0.6*2 = 1.2 1
// 0.2*2 = 0.4 0
// 0.4*2 = 0.8 0
// 死循环 所以0.1无法完整用二进制转换
console.log((0.1).toString(2))
//0.0001100110011001100110011001100110011001100110011001101

//二进制转base64
let lee = Buffer.from('李')
console.log(lee) //<Buffer e6 9d 8e>
console.log((0xe6).toString(2)) //11100110
console.log((0x9d).toString(2)) //10011101
console.log((0x8e).toString(2)) //10001110
//将8位字节 转为 6位字节 111001 101001 110110 001110
console.log(parseInt('111001', 2)) //57
console.log(parseInt('101001', 2)) //41
console.log(parseInt('110110', 2)) //54
console.log(parseInt('001110', 2)) //14
let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
str += str.toLowerCase()
str += '0123456789+/'
console.log(str[57] + str[41] + str[54] + str[14]) //5p2O
console.log(lee.toString('base64')) //5p2O

function transer(str) {
  let chart = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let buffer = Buffer.from(str)
  let result = ''
  for (const item of buffer) {
    result += item.toString(2)
  }
  return result
    .match(/\d{6}/g)
    .map((num) => parseInt(num, 2))
    .map((index) => chart[index])
    .join('')
}
console.log(transer('我'))
console.log(Buffer.from('我').toString('base64'))
