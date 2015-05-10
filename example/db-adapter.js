module.exports = Adapter;

function Adapter(pouch) {
  if ( !(this instanceof Adapter) ) return new Adapter(pouch);
  this._db = pouch;
}

/**
 * createNode
 *
 * nodeData is hash of embedded attributes on node doc, no id or type.
 *
 * metadata is an array with objects like:
 * [ {field: 'something', value: 'something'} ]
 */
Adapter.prototype.createNode = function(nodeData, metadata) {

  var values = metadata.map(function(pair) {
    return {
      name: pair.value,
      _id: 'value'+pair.value,
      type: 'value',
      belongsTo: 'field'+pair.field,
    };
  });

  var fields = metadata.map(function(pair) {
    return {
      name: pair.field,
      _id: 'field' + pair.field,
      type: 'field',
    };
  });

  nodeData._id = 'node'+nodeData.name;
  nodeData.tyoe = 'node';
  nodeData.metadata = metadata.map(function(pair) {
    return {
      field: createId('field', pair.field),
      value: createId('value', pair.value)
    };
  });

  var opts = {
    include_docs: true
  };

  return this._db.bulkDocs(values.concat(fields, nodeData), opts)
    .then(function(resp) {
      console.log(resp);
    })
    .catch(function(err) {
      console.log(err);
    });
};

function createId(type, name) {
  return type+name;
}

// put a single new document
Adapter.prototype.put = function(doc) {
  if (!doc.type || !doc.name) { throw new Error('need type attribute'); }
  doc._id = createId(doc.type, doc.name)+Date.now();
  return this._db.put(doc);
};
