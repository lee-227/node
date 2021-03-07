module.exports = {
  port: {
    option: "-p,--port <v>",
    descriptor: "set your server port",
    usage: "ls --port 8888",
    default: 8888,
  },
  directory: {
    option: "-d,--directory <v>",
    descriptor: "set your server start directory",
    usage: "ls --directory D:",
    default: process.cwd(),
  }
};
