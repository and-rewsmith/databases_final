const express = require('express');
var mysql = require('mysql');
var cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.all('/*', function(req, res, next) {
  // Cors add default headers - this should be changed to only localhost for full deployment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Expose-Headers", "X-Total-Count");
  res.header("X-Total-Count", 100);
  next();
});

var whitelist = [
    'http://localhost:3000',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json())

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'Library'
});






let deleteFromDB = (ids, res) => {

	console.log(ids);

	let select_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id WHERE book.book_id=`;
	let delete_query = `DELETE FROM book WHERE book_id=`;

	out = [];
	let first_record = null;
	for (i=0; i<ids.length; i++) {
		console.log(select_query+ids[i]);
		console.log(delete_query+ids[i]);
		let tmp_delete_query = delete_query + ids[i];

		connection.query(select_query+ids[i], function (err, rows, fields) {
	      	if (err) throw err;
		  	record = JSON.parse(JSON.stringify(rows))[0];
		  	console.log("SELECTED:");
		  	console.log(record);
		  	console.log();
		  	if (i == 0) {
		  		first_record = record;
		  	}
		  	console.log("DELETE QUERY:");
		  	console.log(tmp_delete_query);
		  	console.log(ids);
			connection.query(tmp_delete_query, function (err, rows, fields) {
		      	if (err) throw err;		  
			  	out.push(record.id);
			});
		});
	}

	if (ids.length > 1) {
		return {data: out};
	}
	else if (ids.length == 1) {
		return {data: first_record};
	}

	res.send({data: {id:1}});
}







app.get('/', (req, res) => {
	console.log("DEBUG ROOT");
	res.send('Placeholder');
});

// append /admin for our http requests
//app.use("/admin", admin);

//GET_LIST: ?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}
//GET_MANY: ?filter={ids:[123,456,789]}
//GET_MANY_REFERENCE: ?filter={author_id:345}
app.get('/books', (req, res) => {

	let range = null;
	let sort = null;
	let filter = null;
	
	if (req.query.range == null) {
		range = [0, 25];
	}
	else {
		range = JSON.parse(req.query.range);
	}
	if (req.query.sort == null) {
		sort = ["book_id", "ASC"];
	}
	else {
		sort = JSON.parse(req.query.sort);
	}
	if (req.query.filter == null) {
		filter = '';
	}
	else {
		filter = JSON.parse(req.query.filter);
	}

	let field = sort[0];
	let order = sort[1];
	let start_index = range[0];
	let max_entries = range[1];

	// //Condition is a reserved word so I couldn't make this map well like the other aliases
	// if (field == "Condition") {
	// 	field = "Cond";
	// }

	let sql_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id ORDER BY ${field} ${order} LIMIT ${range[0]}, ${range[1]};`;

	// console.log(sql_query);
	// console.log(sort);
	// console.log(range);
	// console.log(filter);
	// console.log('\n');

	connection.query(sql_query, function (err, rows, fields) {
	  if (err) throw err;
	  rows = JSON.parse(JSON.stringify(rows));

	  connection.query("SELECT COUNT(*) as count FROM book;", function (err, count_row, fields) {
	  	let output = {data: rows, total: count_row[0]["count"]};
	  	// console.log(output.data);
	  	// console.log(output.total)
		res.send(output);
	  });

	});

});

app.get('/books/:id', (req, res) => {

	let sql_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id WHERE book.book_id=` + req.params.id;

	connection.query(sql_query, function (err, rows, fields) {
	  if (err) throw err;
	  record = JSON.parse(JSON.stringify(rows))[0];
	  if (record != null) {
	  	res.send({data: record});
	  }
	  else {
	  	res.send({status: 404});
	  }
	  
	});

});

//CREATE
app.post('/books', (req, res) => {

	// body = res.body;
	// ISBN = body["ISBN"];
	// con = body["con"];

	// connection.query('INSERT INTO book (ISBN, con) VALUES (${ISBN}, ${con});' + req.params.id, function (err, rows, fields) {
	//   if (err) throw err;

	//   res.send({success: true});
	// });

	// connection.end();

	res.send({
	    data: { id: 123, title: "hello, world!" }
	});


	//TODO: get id and make mapping
});

//UPDATE
app.put('/books/:id', (req, res) => {

	let update_query = `UPDATE book SET isbn = ${req.body.isbn},con = \"${req.body.con}\" WHERE book_id = ${req.body.id};`

	let select_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id WHERE book.book_id=` + req.params.id;

	connection.query(update_query, function (err, rows, fields) {
	  if (err) throw err;
	    connection.query(select_query, function (err, rows, fields) {
	      if (err) throw err;
		  record = JSON.parse(JSON.stringify(rows))[0];
		  res.send({data: record});
		});
	});
});

//DELETE
app.delete('/books/:id', (req, res) => {
	
	let ids = [req.params.id];
	deleteFromDB(ids, res);	

});

app.delete('/books', (req, res) => {
	
	let ids = JSON.parse(req.query.filter).id
	deleteFromDB(ids, res);

});


app.get('/isbn/:id', (req, res) => {

	let sql_query = `SELECT isbn_table.isbn FROM isbn_table WHERE isbn_table.isbn=` + req.params.id;
	console.log(sql_query);

	connection.query(sql_query, function (err, rows, fields) {
	  if (err) throw err;
	  record = JSON.parse(JSON.stringify(rows))[0];
	  console.log(record);
	  if (record != undefined) {
	  	res.send({data: record});
	  }
	  else {
	  	res.send({status: 404});
	  }
	  
	});

});





app.listen(port, () => console.log(`Example app listening on port ${port}!`))