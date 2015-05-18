module.exports = Adapter;

function Adapter(pouch) {
  if ( !(this instanceof Adapter) ) return new Adapter(pouch);
  this._db = pouch;
}

// put a single new document
Adapter.prototype.put = function(doc) {
  if (!doc.type || !doc.name) { throw new Error('need type attribute'); }
  doc._id = createId(doc.type, doc.name)+Date.now();
  return this._db.put(doc);
};
