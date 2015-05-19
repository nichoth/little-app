var pouch = require('./db');

module.exports = function(db, restart) {
  var el = document.getElementById('dev-stuff');
  el.querySelector('button').addEventListener('click', clearDb);

  function clearDb() {
    db.allDocs({include_docs: true}).then(function(resp) {
      var docs = resp.rows.map(function(row) {
        row.doc._deleted = true;
        return row.doc;
      });
      return db.bulkDocs(docs);
    });
  }
};
