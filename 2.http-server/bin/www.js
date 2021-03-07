#! /usr/bin/env node

const program = require("commander");
const config = require("./config");
const { forEachObj } = require("../utils");
program.name('lee-serve');
forEachObj(config, (key, val) => {
  program.option(val.option, val.descriptor);
});
program.on("--help", function () {
  console.log("\r\nExamples:");
  forEachObj(config, (key, val) => {
    console.log("  " + val.usage);
  });
});
program.parse(process.argv);
const finalConfig = {};
forEachObj(config, (key, val) => {
  finalConfig[key] = program.opts()[key] || val.default;
});
const Server = require("../src/index");
let server = new Server(finalConfig);
server.start();
