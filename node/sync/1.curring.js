// const curring = (fn, ...arg) => {
//   let len = fn.length
//   let args = [...arg]
//   let newFn = (...newArg) => {
//     args.push(...newArg)
//     if (args.length >= len) {
//       fn(...args)
//     } else {
//       return newFn
//     }
//   }
//   return newFn
// }
const curring = (fn, ...arg) => {
  let len = fn.length
  return (...newArg) => {
    let args = [...arg, ...newArg]
    if (args.length >= len) {
      fn(...args)
    } else {
      return curring(fn, ...args)
    }
  }
}
function sum(a, b, c, d) {
  console.log(a + b + c + d)
}
let newSum = curring(sum)
newSum(1, 1)(1, 1)
