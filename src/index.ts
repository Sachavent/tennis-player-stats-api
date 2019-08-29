import * as cluster from "cluster";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as os from "os";
import * as path from "path";
import * as restify from "restify";
import { config, loadConfiguration } from "./utils/configuration";
import { instantiateLogger, logger } from "./utils/logger";
import { validation } from "./utils/validation-params";

// Instantiate logger for app
instantiateLogger();

// Load configuration for app
loadConfiguration();

// Load parameters which will be used inside route and in json schema validation
const params = yaml.safeLoad(
  fs.readFileSync(path.resolve(__dirname, "..", "schemas", "parameters.yml"), "utf8")).parameters;

/**
 * Function to log restify errors
 * @param req
 * @param res
 * @param error
 * @param callback
 */
function errorHandler(req: restify.Request, res: restify.Response, error, callback) {
  logger.error(error);
  // log error
  req.log.error(error);
  // force no cache
  res.cache("no-cache");
  return callback();
}

// Taking advantage of multi-core systems
if (cluster.isMaster &&
  config.isClusterActive === true &&
  os.cpus().length > 1) {
  // fork workers.
  for (const cpu of os.cpus()) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    logger.info(`worker ${worker.process.pid} died`);
  });
} else {

  // Instantiate server
  const server = restify.createServer({ name: "tennis-player-api" });

  // restify plugins
  server.pre(restify.pre.userAgentConnection());
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser({ mapParams: true }));

  // body parser for post request
  server.use(restify.plugins.bodyParser({
    mapParams: true,
    maxBodySize: 512 * 1024, // 512k
    maxFileSize: null
  }));

  // Validation parameters
  server.use(validation);

  // Server error logging
  server.on("error", (err) => {
    logger.error(err);
  });

   // server logger
  server.on("after", restify.plugins.auditLogger({log: logger, event: "after"}));

  server.on("restifyError", errorHandler);

  // load routes with parameters schema
  require("./routes/routes")(server, params);

  // variable PORT is used by heroku
  server.listen(process.env.PORT || 3000, function () {
    logger.info(`Example app listening on port ${process.env.PORT || 3000}!`);
  });
}
