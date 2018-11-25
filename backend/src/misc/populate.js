var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'Library'
});

connection.query("SELECT book_id FROM book;", function (err, rows, fields) {
  if (err) throw err;
  rows = JSON.parse(JSON.stringify(rows));

  for (i=0; i<rows.length; i++) {
  	let book_id = parseInt(rows[i]["book_id"]);
  	connection.query("SELECT book_id FROM book;", function (err, rows, fields) {

  	}

  }



});
