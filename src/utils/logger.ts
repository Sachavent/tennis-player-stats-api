import * as bunyan from "bunyan";

let logger = null;

/**
 * Creating logger
 */
function instantiateLogger() {
  logger = bunyan.createLogger({
    level: "trace",
    name: "api-tennis-player",
    // Better logging Request properties
    serializers: bunyan.stdSerializers,
    stream: process.stdout
  });

  logger.info(`Logger initialised`);
}

export {
  logger, instantiateLogger
};
