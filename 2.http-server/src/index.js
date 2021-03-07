const http = require('http')
const chalk = require('chalk')
const path = require('path')
const url = require('url')
const fs = require('fs').promises
const mime = require('mime')
const ejs = require('ejs')
const { createReadStream, readFileSync } = require('fs')
const crypto = require('crypto')
class Server {
  constructor({ port, directory }) {
    this.port = port
    this.directory = directory
    this.template = readFileSync(
      path.resolve(__dirname, './index.html'),
      'utf-8'
    )
  }
  async handelRequest(req, res) {
    let { pathname } = url.parse(req.url)
    pathname = decodeURIComponent(pathname)
    let filePath = path.join(this.directory, pathname)
    try {
      let stat = await fs.stat(filePath)
      if (stat.isFile()) {
        this.sendFile(req, res, stat, filePath)
      } else {
        let dirs = await fs.readdir(filePath)
        dirs = dirs.map((file) => ({
          dir: file,
          href: path.join(pathname, file),
        }))
        let result = await ejs.render(this.template, { dirs }, { async: true })
        res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.end(result)
      }
    } catch (error) {
      console.log(error)
      this.sendError(res)
    }
  }
  cache(req, res, statObj, filePath) {
    res.setHeader('Expires', new Date(Date.now() + 5 * 1000).toGMTString())
    res.setHeader('Cache-Control', 'no-cache')
    let ifModifiedSince = req.headers['if-modified-since']
    let ctime = statObj.ctime.toGMTString()
    let ifNoneMatch = req.headers['if-none-match']
    let etag = crypto
      .createHash('md5')
      .update(readFileSync(filePath))
      .digest('base64')

    res.setHeader('Last-Modified', ctime)
    res.setHeader('Etag', etag)
    
    if (ifModifiedSince !== ctime) return false
    if (ifNoneMatch !== etag) return false
    return true
  }
  sendFile(req, res, statObj, filePath) {
    if (this.cache(req, res, statObj, filePath)) {
      res.statusCode = 304
      return res.end()
    }
    res.setHeader('Content-Type', mime.getType(filePath) + ';chartset=utf-8')
    createReadStream(filePath).pipe(res)
  }
  sendError(res) {
    res.statusCode = 404
    res.end('Not Found')
  }
  start() {
    let server = http.createServer(this.handelRequest.bind(this))
    server.listen(this.port, () => {
      console.log(
        `${chalk.yellow('Server start at')} ./${path.relative(
          process.cwd(),
          this.directory
        )}`
      )
      console.log(`  http://localhost:${chalk.green(this.port)}`)
    })
  }
}
module.exports = Server
