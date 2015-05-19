var pouch = require('./db');

var el = document.getElementById('dev-stuff');

module.exports = function(db, restart) {
  el.querySelector('button').addEventListener('click', function(ev) {
    db.allDocs({include_docs: true}).then(function(resp) {
      console.log(resp);
      var docs = resp.rows.map(function(row) {
        row.doc._deleted = true;
        return row.doc;
      });
      return db.bulkDocs(docs);
    });
  });
};
