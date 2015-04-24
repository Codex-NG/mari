var session = require('./session-manager.js');
var utils = require('./utilities.js');


function intercept(req, res, next) {
  if (req.url == '/') {
    if (session.isCookieValid(req)) {
      next();
    } else {
      utils.redirectToLoginPage(req, res);
    }
  } else if (req.url == '/login/') {
    if (session.isCookieValid(req)) {
      var location = req.protocol + '://' + req.get('Host') + '/';
      utils.HTTPRedirect(res, location);
    } else {
      next();
    }
  }
  else {
    next();
  }
}
exports.intercept = intercept;


// Middle-ware to validate X-Auth-Token for API calls that require authentication
function validTokenForApi(req, res, next) {
  if (session.isCookieValid(req)) {
    next();
  } else {
    utils.HTTPError(401, "Unauthorized", "Please login with valid credentials", res);
  }
}
exports.validTokenForApi = validTokenForApi;


// serve index.html
function pushStateSupport(req, res, next) {
  if (session.isCookieValid(req)) {
    res.sendfile('index.html', {
      root: '.' + utils.getAppRoot()
    });
  } else {
    utils.redirectToLoginPage(req, res);
  }
}
exports.pushStateSupport = pushStateSupport;

// set caching policy in header
function setCachingHeader(req, res, next) {
  if(utils.getAppRoot() === "/dist"){
    if(req.url.match('^/$')){
      res.setHeader('Cache-Control', 'no-cache, max-age=0');
    }
    if(req.url.match('partials/')){
      res.setHeader('Cache-Control', 'no-cache, max-age=0');
    }
    if(req.url.match('worksite/')){
      res.setHeader('Cache-Control', 'no-cache, max-age=0');
    }
    if(req.url.match('login/' || 'login/index.html')){
      res.setHeader('Cache-Control', 'private, max-age=60');
    }
    if(req.url.match('\.(js|css|svg|jpg|woff)$')){
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    if(req.url.match('/api/v1/.+')){
      res.setHeader('Cache-Control', 'private, max-age=10');
    }
    if(req.url.match('/api/v1/session/login')){
      res.setHeader('Cache-Control', 'no-store, max-age=0');
    }
  }
  next();
}
exports.setCachingHeader = setCachingHeader;
