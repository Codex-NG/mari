var _ = require('underscore');
var q = require('q');
var fs = require('fs');
var file = "data/database.db";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var filterNull = function (obj) {
  _.each(obj, function (val, key) {
    if (val === null) {
      delete obj[key];
    }
  });
};

var makeBool = function (obj) {
  _.each(obj, function (val, key) {
    if (key.indexOf("is") === 0 ||
      key.indexOf("has") === 0) {
      if (typeof val === "string") {
        if (val === "true") {
          obj[key] = true;
        }
        else if (val === "false") {
          obj[key] = false;
        }
      }
    }
  });
};

exports.folderTypes = {
  workspace: 0,
  folder: 1
};

//TODO unused: remove?
var docTypes = {
  "MIME": ["msg", "dxl"],
  "XML": ["xml"],
  "ACROBAT": ["pdf"],
  "ANSI": ["txt"],
  "WORD": ["doc", "docx"],
  "NOTES": ["notes"],
  "PPT": ["ppt", "pptx"],
  "EXCEL": ["xls", "xlsx"]
};

exports.timePeriodToQuery = function (time) {
  var timePeriod = time.split(':')[0];
  var timeMeasure = time.charAt(time.length - 1);
  if (timeMeasure == 'd') {
    timeMeasure = 'day';
  } else if (timeMeasure = 'm') {
    timeMeasure = 'month';
  }
  return "date('now', '" + timePeriod + " " + timeMeasure + "')";
};

var createFolder = function (row, database) {
  var id = database ? {id: database + "!" + row.id} : {id: 'ACTIVE' + '!' + row.id};
  var folder = _.extend(row, id, {wstype: "folder"});
  filterNull(folder);
  makeBool(folder);
  return folder;
};

var createDocument = function (row, database, type) {
  var id = database ? {id: database + "!" + row.id} : {id: 'ACTIVE' + '!' + row.id};
  var doc = _.extend(row, id, {wstype: "document"});
  if (type === "edited") {
    doc.activity_date = row.edit_date;
  }
  filterNull(doc);
  makeBool(doc);
  return doc;
};

var createEmail = function (row, database) {
  var id = database ? {id: database + "!" + row.id} : {id: 'ACTIVE' + '!' + row.id};
  var email = _.extend(row, id, {from: row.receiver}, {received_date: row.edit_date}, {wstype: "document"}); 
  filterNull(email);
  makeBool(email);
  return email;
};

var createWorkspace = function (row, database) {
  var id = database ? {id: database + "!" + row.id} : {id: 'ACTIVE' + '!' + row.id};
  var workspace = _.extend(row, id, {wstype: "workspace"});
  filterNull(workspace);
  makeBool(workspace);
  return workspace;
};

var getRecords = function(objectFn, query, database, type) {
  var deferred = q.defer();
  var data = [];
  db.each(query.toString(), function (err, row) {
    if (!err) {
      data.push(objectFn(row, database, type));
    } else {
      console.log(err.message);
      deferred.notify(err);
      //deferred.reject?
    }
  }, function () {
    deferred.resolve(data);
  });
  return deferred.promise;
};

// Database calls
exports.getWorkspaces = function (query, database) {
  return getRecords(createWorkspace, query, database);
};

exports.getFolders = function (query, database) {
  return getRecords(createFolder, query, database);
};

exports.getDocuments = function (query, database, type) {
  return getRecords(createDocument, query, database, type);
};

exports.getEmails = function (query, database) {
  return getRecords(createEmail, query, database);
};

exports.getRecentDocsInWorkspaces = function (query, database, type) {
  return getRecords(createDocument, query, database, type)
};

exports.getFolderChildren = function (query, database) {
  var deferred = q.defer();
  var data = [];

  db.each(query.toString(), function (err, row) {
    if (!err) {
      if (row.owner) {
        data.push(createFolder(row, database));
      } else if (row.type === "MIME") {
        data.push(createEmail(row, database));
      } else if (row.ext) {
        data.push(createDocument(row, database));
      }
    } else {
      console.log(err.message);
      deferred.notify(err);
    }
  }, function () {
    deferred.resolve(data);
  });
  return deferred.promise;
};

var getCount = function(query) {
  var deferred = q.defer();
  var count = 0;
  db.get(query, function (err, row) {
      if (!err) {
        count = row.count;
      } else {
        console.log(err.message);
        deferred.reject(err);
      }
      deferred.resolve(count);
    });
  return deferred.promise;
};

var getConversationCount = function (id){
  // var count = 1;
  var query = "SELECT Count(*) as count FROM documents WHERE conversationId=" + id;
  db.get(query, function (err, row) {
    if (!err) {
      return row.count;
    } else {
      console.log(err.message);
    }
  });
};

exports.getFolderChildrenCount = function (folderId) {
  var query = "SELECT (SELECT Count(*) FROM folders WHERE parent=" + folderId +
    ") + (SELECT Count(*) FROM documents WHERE parent=" + folderId + ") as count";
  return getCount(query);
};

exports.getWorkspaceChildrenCount = function (workspaceId) {
  var query = "SELECT Count(*) as count FROM folders WHERE parent=" + workspaceId;
  return getCount(query);
};

exports.getWorkspaceCount = function () {
  var query = "SELECT Count(*) as count FROM folders WHERE type=0";
  return getCount(query);
};

exports.getDocumentCount = function (condition) {
  var queryCondition = condition ? " WHERE " + condition : "";
  var query = "SELECT Count(*) as count FROM documents" + queryCondition;
  return getCount(query);
};

exports.getEmailCount = function (condition) {
  var queryCondition = condition ? " WHERE " + condition : "";
  var query = "SELECT Count(*) as count FROM documents" + queryCondition;
  return getCount(query);
};

exports.getDocumentExtension = function (documentId, complete) {
  var ext;
  db.get("SELECT ext FROM documents WHERE id=" + documentId, function (err, row) {
    if (!err) {
      ext = row.ext;
    } else {
      console.log(err.message);
    }
    complete(ext);
  });
};

exports.getConditionFromQuery = function (query) {
  var query = query.toString();
  var condition = query.indexOf('WHERE') > -1 ? query.split('WHERE')[1] : '';
  return condition;
}

exports.updateDocumentActivity = function (id) {
  db.run("UPDATE documents SET activity_date = $dateNow WHERE id= $id", {
    $id: id,
    $dateNow: Date.now() / 1000 | 0
  });
}

exports.updateDocumentFolderActivity = function (documentId) {
  db.run("UPDATE folders SET activity_date = $dateNow WHERE id=(SELECT parent FROM documents WHERE id= $id)", {
    $id: documentId,
    $dateNow: Date.now() / 1000 | 0
  });
}

exports.updateDocumentWorkspaceActivity = function (documentId) {
  db.run("UPDATE folders SET activity_date = $dateNow WHERE id=(SELECT parent FROM folders WHERE id=(SELECT parent FROM documents WHERE id= $id))", {
    $id: documentId,
    $dateNow: Date.now() / 1000 | 0
  });
}

exports.isEmailFolder = function (folderId) {
  var deferred = q.defer();
  var isEmailFolder = false;
  db.get('SELECT viewType FROM folders WHERE id=' + folderId, function (err, row) {
      if (!err) {
        isEmailFolder = row.viewType == "email" ? true : false;
      } else {
        console.log(err.message);
        deferred.reject(err);
      }
      deferred.resolve(isEmailFolder);
    });
  return deferred.promise;
}