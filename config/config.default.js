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
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552666198572_3503';

  // add your middleware config here
  config.middleware = [];
  
  config.cluster = {
      listen: {
        // path: '',
        port: 7222,
        // hostname: 'localhost',
      }
  };
//  config.cors = {
//     enable: true,
//     package: 'egg-cors',
// };
// config.security = {
//   csrf: {
//     enable: false,
//     ignoreJSON: true
//   },
//   // domainWhiteList:[]
// };
// config.cors = {
//   origin:'*',
//   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
// };
  config.mongoose = {
    url: 'mongodb://127.0.0.1/huanghepiaowu',
    options: {},
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  userConfig.crawler_host="https://m.huanghepiao.com";

  return {
    ...config,
    ...userConfig,
  };
};
