'use strict';
const createLogger = require('./createLogger');
const defaultConfigParams = require('./configParams');
const cosmiconfig = require('cosmiconfig');
const logger = createLogger(process.env.APPLITOOLS_SHOW_LOGS); // TODO when switching to DEBUG sometime remove this env var
const explorer = cosmiconfig('applitools', {
  searchPlaces: ['package.json', 'applitools.config.js', 'eyes.config.js', 'eyes.json'],
});

function initConfig(configParams) {
  let defaultConfig = {};
  try {
    const result = explorer.searchSync();
    if (result) {
      const {config, filepath} = result;
      logger.log('loading configuration from', filepath);
      defaultConfig = config;
    }
  } catch (ex) {
    logger.log('an error occurred while searching for configuration', ex);
  }

  configParams = configParams
    ? uniq(defaultConfigParams.concat(configParams))
    : defaultConfigParams;

  const envConfig = {};
  for (const p of configParams) {
    envConfig[p] = process.env[`APPLITOOLS_${toEnvVarName(p)}`];
  }

  for (const p in envConfig) {
    if (envConfig[p] === undefined) delete envConfig[p];
  }

  const priorConfig = Object.assign({}, defaultConfig, envConfig);
  const initialConfig = Object.assign({}, priorConfig);

  logger.log(`running with initial config: ${JSON.stringify(initialConfig)}`);

  return {
    getConfig(config) {
      const ret = Object.assign({}, priorConfig, config);
      logger.log(`getConfig ${JSON.stringify(ret)}`);
      return ret;
    },
    getInitialConfig() {
      return Object.assign({}, initialConfig);
    },
    updateConfig(partialConfig) {
      Object.assign(priorConfig, partialConfig);
    },
  };
}

function toEnvVarName(camelCaseStr) {
  return camelCaseStr.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase();
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

module.exports = {
  initConfig,
  toEnvVarName,
};
