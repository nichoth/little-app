var pg = require('pg');

pg.connect(process.env.DATABASE_URL, function(err, client) {
  var query = client.query('CREATE TABLE nodes('
    + 'id INT PRIMARY KEY NOT NULL,'
    + 'name TEXT NOT NULL,'
    + 'date TIMESTAMP'
    + ');'
  );

  query.on('row', function(row) {
    console.log(JSON.stringify(row));
  });
});
