const log4js = require("log4js");
var PropertiesReader = require("properties-reader");
var properties = PropertiesReader("server.properties");

// log4j details
log4js.configure({
  appenders: {
    loggerAppend: {
      type: properties.get("log4j.type"),
      filename: properties.get("log4j.filename"),
      maxLogSize: properties.get("log4j.logfilesize"),
      backups: properties.get("log4j.noofdays"),
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ["loggerAppend"],
      level: properties.get("log4j.logger.level")
    }
  }
});
const logger = log4js.getLogger("loggerAppend");

module.exports = logger;