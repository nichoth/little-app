/**
 * expandNode - take a hash and turn it into separate related objects.
 *
 * nodeData is hash of attributes on node doc, no id or type.
 *
 * metadata is an array with objects like:
 * [
 *   {field: 'something', value: 'something'}
 * ]
 */
module.exports = function expandNode(nodeData, metadata) {

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

  nodeData._id = 'node'+nodeData.name+Date.now();
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
      console.log(arguments);
    })
    .catch(function(err) {
      console.log(err);
    });
};

function createId(type, name) {
  return type+name;
}

