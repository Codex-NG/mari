var jsonQuery = require('json-query');
var config = require('./config.js');

// TokenList
var TokenList = { "current" : [] };
var PreviewTokenList = { "current": [] };

// will create a unique token and return it
exports.newToken = function (){
  return "thisisasessiontoken";
};

// adds a token to the TokenList
exports.addToken = function (token){
  var session = {
    "token" : token,
    "createTime" : new Date() 
  };
  if(hasToken(token)){
    exports.renewToken(token);
  }else{
    TokenList.current.push(session);
  }
};

exports.addPreviewToken = function (docNo, version){
  var token = Date.now();
  var previewToken = {
    "docNo": docNo,
    "ver": version,
    "token": token 
  };
  PreviewTokenList.current.push(previewToken);
  return token;
}

// determines if a token exists in the TokenList
var hasToken = function (token){
  var output = false;
  var currSession = jsonQuery('current[token='+token+']', {data: TokenList}).value;
  if(currSession){
    output = true;
  }
  return output;
};

// renews a token in the TokenList
exports.renewToken = function (token){
  var currSession = jsonQuery('current[token='+token+']', {data: TokenList}).value;
  currSession.createTime = new Date();
}

// verifies if the token exists in the token list
exports.isValid = function (token){
  var output = false;
  var currSession = jsonQuery('current[token='+token+']', {data: TokenList}).value;
  if(currSession){
    output = true;
  }
  return output;
};

exports.isPreviewTokenValid = function (token){
  var output = false;
  var currSession = jsonQuery('current[token='+token+']', {data: PreviewTokenList}).value;
  var now = Date.now();
  if(currSession && currSession.token && (now - currSession.token) < config.previewTokenExpiration){
    output = true;
  }
  return output;
}

var getCookie = function (req){
  var reqCookie;
  console.log(req.headers);
  if(req.headers.cookie){
    reqCookie = cookie.parse(req.headers.cookie);
  }
  return reqCookie;
}

var getRequestToken = function (req){
  var token;
  if(req.cookies && req.cookies['X-Auth-Token']){
    token = req.cookies['X-Auth-Token'];
  }else if(req.headers['x-auth-token']){
    token = req.headers['x-auth-token'];
  }else if(req.query['X-Auth-Token']){
    token = req.query['X-Auth-Token'];
  }
  return token;
}

exports.isCookieValid = function (req){
  var token = getRequestToken(req);
  if(token){
    return exports.isValid(token);
  }else{
    return false;
  }
}

// TODO remove expired tokens periodically