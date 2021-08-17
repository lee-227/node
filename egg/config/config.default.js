/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1629167666964_1386';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.mongoose = {
    client: {
      url: 'mongodb://106.75.254.155/youtube-clone',
      options: {
        useUnifiedTopology: true,
      },
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  };

  config.jwt = {
    secret: 'a6e8561e-58df-4715-aa21-b5d1a091e71a',
    expiresIn: '1d',
  };

  config.cors = {
    origin: '*',
  }

  return {
    ...config,
    ...userConfig,
  };
};
