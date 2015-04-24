// server configurations

var config = {};

config.defaultPort = 8000;
config.defaultRoot = '/app';
config.apiPrefix = '/api/v1'; // api prefix
config.apiProxy = 'https://wrtest1.hpswlabs.hp.com/api';
config.cookieExpiration = 24 * 60 * 60 * 1000; // in milliseconds, 1 second = 1000 milliseconds
config.previewTokenExpiration = 24 * 60 * 60 * 1000; // preview token expiration: 24 hours

module.exports = config;