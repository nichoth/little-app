var Pouch = require('pouchdb');
var pouch = new Pouch('little-app-test2');

// put design docs in pouch
module.exports = function db() {
  var views = [];
  views.push({
    _id: '_design/name',
    views: {
      'name': {
        map: function (doc) { emit(doc.name); }.toString()
      }
    }
  });

  // index on user-created metadata
  views.push({
    _id: '_design/kv',
    views: {
      'kv': {
        map: function(doc) {
          if (doc.type === 'node') {
            doc.metadata.forEach(function(pair) {
              emit([pair.field, pair.value]);
            });
          }
        }.toString()
      }
    }
  });

  return pouch.bulkDocs(views).then(function() {
    return pouch;
  }).catch(function(err) {
    console.log(err);
  });
};
