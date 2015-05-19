var React = require('react');
var CreateNodeView = require('./CreateNodeView.react.js');
window.React = React;
var listView = require('./list-view');
var devStuff = require('./dev-stuff-view');
var Handler = require('./save-node');

var handler, db;
require('./db')().then(function(pouch) {
  db = pouch;
  handler = Handler(pouch);
  init();
});

function init() {
  devStuff(db, init);
  listView(db);
  React.render(<CreateNodeView submitHandler={handler} />,
    document.getElementById('form-stuff'));
}
