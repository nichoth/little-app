var React = require('react');
var CreateNodeView = require('./CreateNodeView.react.js');
window.React = React;
var listView = require('./list-view');
var devStuff = require('./dev-stuff-view');
var uuid = require('node-uuid');

var db;
require('./db')().then(function(pouch) {
  db = pouch;
  init(pouch);
});

function expandNode(node) {

  // create objects from metadata
  var fieldsByName = {};
  var valuesByName = {};
  node.metadata.forEach(function(pair) {
    fieldsByName[pair.field] = { name: pair.field };
    valuesByName[pair.value] = { name: pair.value };
  });

  return {
    fields: fieldsByName,
    values: valuesByName,
    node: node
  };
};

// save fields and values
function bulkSave(docs) {
  var opts = {
    include_docs: true
  };

  return db.bulkDocs(docs, {include_docs: true})
    .then(function(resp) {
      console.log('bulk save ', arguments);
    }).catch(function(err) {
      console.log('err', arguments);
    })
  ;
}

function createId(type) {
  return type+uuid.v1();  // time based uuid
}

function serializeField(hash) {
  hash._id = createId('field');
  hash.type = 'field';
  return hash;
}

function serializeValue(hash) {
  hash._id = createId('value');
  hash.type = 'vlaue';
  return hash;
}

function handle(doc) {
  var expanded = expandNode(doc);

  var fieldDocs = Object.keys(expanded.fields).map(function(field) {
    return serializeField( expanded.fields[field] );
  });
  var valDocs = Object.keys(expanded.values).map(function(val) {
    return serializeValue( expanded.values[val] );
  });

  bulkSave(fieldDocs.concat(valDocs)).then(function(resp) {
    var node = expanded.node;
    node._id = createId('node');
    node.type = 'node';
    console.log(node);
    node.metadata = node.metadata.map(function(pair) {
      return {
        field: fieldDocs.filter(function(field) {
          return field.name === pair.field;
        })[0]._id,
        value: valDocs.filter(function(val) {
          return val.name === pair.value;
        })[0]._id
      };
    });

    // save the node with refs to ids
    db.put(node, {include_docs: true}).then(function() {
      console.log(arguments);
    });
  });
}

function init(db) {
  devStuff(db, init);
  listView(db);
  React.render(<CreateNodeView submitHandler={handle} />,
    document.getElementById('form-stuff'));
}
