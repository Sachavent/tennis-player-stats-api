import * as configLib from "config";
import { logger } from "./logger";

interface Configuration {
  isClusterActive: boolean;
  database: {
    connection: {
      host: string;
      user: string;
      password: string;
      database: string;
    }
  };
  tokenTTL?: number;
}

let config: Configuration = null;

/**
 * Load configuration and cast config to Configuration interface type
 */
function loadConfiguration() {
  // Casting config from IConfig to any, to match to a new interface
  config = <any> configLib;
  logger.info(`Configuration initialised`);
}

export { config, loadConfiguration };
