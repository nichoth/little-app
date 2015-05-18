var React = require('react');
var CreateNodeView = require('./CreateNodeView.react.js');
window.React = React;

var Pouch = require('pouchdb');
var db = new Pouch('little-app-test');

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
  return type+Date.now();
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
    node._id = 'node'+Date.now();
    node.type = 'node';
    node.metadata = node.metadata.map(function(pair) {
      return {
        field: fieldDocs._id,
        value: valDocs._id
      };
    });

    // save the node with refs to ids
    db.put(node, {include_docs: true}).then(function() {
      console.log(arguments);
    });
  });
}

React.render(<CreateNodeView submitHandler={handle} />, document.body);
