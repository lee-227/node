function co(it) {
  return new Promise((resolve, reject) => {
    function step(data) {
      let { value, done } = it.next(data)
      if (!done) {
        Promise.resolve(value).then((v) => step(v), reject)
      } else {
        resolve(value)
      }
    }
    step()
  })
}
