const config = require("../config");
const { createLogger } = require('@logdna/logger')

exports.initMezmo = () => {
    if (!config.mezmo.key) {
        console.warn("Unable to Initilize Mezmo");
        return
    }
    const options = {
        app: config.mezmo.appName,
        hostname: config.mezmo.hostName,
        levels: ['info', 'warn', 'critical', 'catastrophic']
    }

    const logger = createLogger(config.mezmo.key, options)
    console.log("Initilizing Mezmo");
    let theConsole = {};
    theConsole.log = console.log;
    console.log = function () {
        for (let i = 0; i < arguments.length; i++) {
            theConsole.log(arguments[i]);
            logger.log(arguments[i])
        }
    }
}