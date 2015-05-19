module.exports = function (db) {

  render();

  var opts = {
    live: true,
    since: 'now',
    include_docs: true,
    filter: function(doc) {
      return doc.hasOwnProperty('type');
    }
  };

  db.changes(opts).on('change', render);

  function render() {
    var opts = {
      include_docs: true,
      startkey: 'field',
      endkey: 'value~'
    };
    db.allDocs(opts).then(function(resp) {
      var docs = resp.rows.map(function(row) {
        return row.doc;
      });
      var el = document.getElementById('list');
      el.innerHTML = docs.map(function(doc) {
        return '<div><pre>'+JSON.stringify(doc, undefined, '  ') + '</pre></div>';
      }).join('');
    });
  }
};
