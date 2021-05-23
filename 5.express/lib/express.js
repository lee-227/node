const Application = require("./application");
const Router = require("./router/index");
function createApplication() {
  const app = new Application();
  return app;
}
createApplication.Router = Router;
module.exports = createApplication;
