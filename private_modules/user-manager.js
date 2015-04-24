var jsonQuery = require('json-query');

var maxFailedAttempts = 5;

// an initial list. move to the database later
var UserList = { "users" : [
{
  "userid": "admin",
  "password": "mhdocs",
  "failedAttempts": 0,
  "type": "admin"
},
{
  "userid": "qa",
  "password": "mhdocs",
  "failedAttempts": 0,
  "type": "admin"
},
{
  "userid": "acase",
  "password": "mhdocs",
  "failedAttempts": 0,
  "type": "admin"
},
{
  "userid": "locked",
  "password": "mhdocs",
  "failedAttempts": 0,
  "type": "user"
}
]};

// add user to the user list
exports.addUser = function (userid, password, type){
  var user = {
    "userid": userid,
    "password": password,
    "failedAttempts": 0,
    "type": type
  };
  if(hasUser){
    return { "error": "Userid already exists" };
  }else{
    UserList.users.push(user);
    return { "success": "User successfully added" };
  }
};

// checks if the user exist in the user list
var hasUser = function (userid){
  var user = jsonQuery('users[userid=' + userid + ']', {data: UserList}).value;
  if(user){
    return true;
  }else{
    return false;
  }
};

// verfies if the userid and password match an entry in the user list
exports.verifyLogin = function (userid, password){
  var user = jsonQuery('users[userid=' + userid + ']', {data: UserList}).value;
  if(user && user.password == password){
    return true;
  }else{
    return false;
  }
}

exports.isAccountLocked = function (userid){
  if(userid == "locked"){
    return true;
  }else{
    return false;
  }
}

exports.resetAccount = function (userid){
  var user = jsonQuery('users[userid=' + userid + ']', {data: UserList}).value;
  if(user){
    user.failedAttempts = 0; 
  }
}