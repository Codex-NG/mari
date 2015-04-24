var config = require('./config.js');

exports.getDatabase = function (req){
  var id = req.params.id;
  if(id.indexOf('!') > -1){
    return id.split('!')[0];
  }else{
    return null;
  }
};

exports.getId = function (req){
  var id = req.params.id;
  if(id.indexOf('!') > -1){
    id = id.split('!')[1];
  }
  return id;
};

exports.getUserInfo = function (req){
  var user = {
    "userid": req.body.userid.toLowerCase(),
    "password": req.body.password
  };
  return user;
};

// Error return function
exports.HTTPError = function (status, code, message, res){
  res.status(status);
  var error = { "error": 
    { 
      "code": code,
      "message": message
    }
  };
  res.json(error);
};


function httpRedirect (res, location) {
  res.statusCode = 302;
  res.setHeader('Location', location);
  res.end();
}
exports.HTTPRedirect = httpRedirect;


exports.redirectToLoginPage = function (req, res) {
  var redirectUrl = req.originalUrl === '/' ? null : encodeURIComponent(req.originalUrl);
  var location = req.protocol + '://' + req.get('Host') + '/login/';
  if(redirectUrl){
    location = location + '?redirectUrl=' + redirectUrl;
  }
  httpRedirect(res, location);
};


exports.getAppRoot = function () {
  return process.env.APP_ROOT || config.defaultRoot
};
