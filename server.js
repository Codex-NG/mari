// public modules
var _ = require('underscore');
var q = require('q');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
var sql = require("squel");

// private modules
//var ws = require('./private_modules/ws-database.js');
var utils = require('./private_modules/utilities.js');
//var interceptor = require('./private_modules/interceptor.js');
var config = require('./private_modules/config.js');

// Create a new express instance:
var app = express();
// The express api has a router object creator that is needed for the api:
var router = express.Router();	// router for the api

// This sets the port from:
// process.env.PORT is defined in nodejs and is stored as an "export" property in app.js
// Perhaps config.defaultPort comes from the same place.
var port = process.env.PORT || config.defaultPort;

app.use('', router); // Adding Express router

//app.use(cookieParser());
//app.use(bodyParser.json());

// Intercept base url
//app.use(interceptor.intercept);

//How does the express router work?
//Serve static file if no matching routes

//Funnel all routes through index.html
//app.use('/*', function(req,res){
//  res.sendFile(__dirname + '/app/index.html');
//});
//app.use('/*', express.static(__dirname + '/app'));	// Serve static file if no matching routes


// serve all asset files from necessary directories
app.use("/js", express.static(__dirname + "/app/js"));
app.use("/images", express.static(__dirname + "/app/images"));
app.use("/styles", express.static(__dirname + "/app/styles"));
app.use("/views", express.static(__dirname + "/app/views"));
app.use("/bower_components", express.static(__dirname + "/app/bower_components"));
app.use("/fonts", express.static(__dirname + "/app/fonts"));

// serve index.html for all remaining routes, in order to leave routing up to angular
app.all("/*", function(req, res, next) {
  res.sendFile("index.html", { root: __dirname + "/app" });
});

app.use(express.static(__dirname + '/app'));	// Serve static file if no matching routes
app.listen(port);
console.log('Server running on port ' + port);

// ReST API ROUTES

// FROM: DMS.JS
/* app.use('/api', function(req, res) {
  var url = config.dmsUrl + "/api" + req.url;
  //console.log('req', req);
  //console.log('res', req);
  //console.log(request(url));
  var proxyOptions = {
    url: url,
    headers: req.headers,
    method: req.method,
    body: req.body,
    followAllRedirects: true,
    rejectUnauthorized: false,
    proxy: undefined,
    json: true
  };
  var proxyReq = request(proxyOptions);
  req.pipe(proxyReq).pipe(res);
  //reqt.pipe(res);
  //request(proxyReq).pipe(res);
}); */

/*router.get(routePrefix + '/workspaces/:id', function (req, res) {
  var id = utils.getId(req);
  var database = utils.getDatabase(req);
  var query = sql.select().from("folders").where("id = ?", id).where("type = ?", ws.folderTypes.workspace);

  ws.getWorkspaces(query, database).then(function (data) {
    if (data.length < 1) {
      res.send(utils.HTTPError(404, "ObjectNotFound", "Requested workspace was not found", res));
    } else {
      res.json({"data": data[0]});
    }
  });
});*/


// If unknown url, return 404
app.use(function (req, res) {
  res.status(404).end();
});
