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





let promisifiedQuery = (query) => {
	return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.

        connection.query(query, function (err, rows, fields) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}


async function deleteFromDB(ids, res) {


	let select_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id WHERE book.book_id=`;
	let delete_query = `DELETE FROM book WHERE book_id=`;

	out = [];
	let first_record = null;
	for (i=0; i<ids.length; i++) {
		
		let tmp_select_query = select_query+ids[i] + ";";
		let tmp_delete_query = delete_query + ids[i] + ";";
		console.log("SELECT ELEMENT TO BE DELETED:");
		console.log(tmp_select_query);
		console.log();
		console.log("DELETE ELEMENT:");
		console.log(tmp_delete_query);
		console.log();

		await promisifiedQuery(tmp_select_query)
			.then(async function (rows) {
			  	record = JSON.parse(JSON.stringify(rows))[0];
			  	if (i == 0) {
			  		first_record = record;
			  	}
				await promisifiedQuery(tmp_delete_query)
				.then(function(rows) {
				  	out.push(record.id);
				  	if (i == ids.length-1) {
			  			if (ids.length > 1) {
							res.send({data: out});
						}
						else if (ids.length == 1) {
							res.send({data: first_record});
						}
				  	}
				})
				.catch( function(err) {
					res.send({status: 500});
				});
			})
			.catch( function (err) {
				res.send({status: 500});
			});
	}
}


app.get('/', (req, res) => {
	res.send('Placeholder');
});

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

	let sql_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id ORDER BY ${field} ${order} LIMIT ${range[0]}, ${range[1]};`;
	console.log("GET LISTVIEW QUERY:");
	console.log(sql_query);
	console.log();

	connection.query(sql_query, function (err, rows, fields) {
	  if (err) throw err;
	  rows = JSON.parse(JSON.stringify(rows));

	  connection.query("SELECT COUNT(*) as count FROM book;", function (err, count_row, fields) {
	  	let output = {data: rows, total: count_row[0]["count"]};
		res.send(output);
	  });

	});

});

app.get('/books/:id', (req, res) => {

	let sql_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id WHERE book.book_id=` + req.params.id + ";";

	console.log("GET ONE RECORD QUERY:");
	console.log(sql_query);
	console.log();

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

	let create_query = ""
	let id_query = `SELECT LAST_INSERT_ID() as id;`
	let select_query = "";

	console.log(req.body);


	if (req.body.isIsbn) {
		create_query = `INSERT INTO isbn_table (isbn, title, dewey, format, pages) VALUES (\"${req.body.newIsbn}\", \"${req.body.title}\", ${req.body.dewey}, \"${req.body.format}\", ${req.body.pages});`;
		select_query = "SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id ORDER BY id DESC LIMIT 0, 1;";
	}
	else {
		create_query = `INSERT INTO book (con, isbn) VALUES (\"${req.body.con}\", \"${req.body.isbn}\");`;
		select_query = "SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id WHERE book.book_id=";

	}
		
	console.log("CREATE QUERY:");
	console.log(create_query);
	console.log();
	console.log("LAST ID QUERY:");
	console.log(id_query);
	console.log();
	connection.query(create_query, function (err, rows, fields) {
	  if (err) throw err;
	  connection.query(id_query, function (err, rows, fields) {
		  if (err) throw err;
		  record = JSON.parse(JSON.stringify(rows))[0];
		  let tmp_select_query = select_query;
		  if (!req.body.isIsbn) {
		  	tmp_select_query += record.id + ";";
		  }
		  console.log("GET ONE RECORD QUERY:");
		  console.log(tmp_select_query);
		  console.log();
		  connection.query(tmp_select_query, function (err, rows, fields) {
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

	});

});

//UPDATE
app.put('/books/:id', (req, res) => {

	let update_query = `UPDATE book SET isbn = ${req.body.isbn},con = \"${req.body.con}\" WHERE book_id = ${req.body.id};`

	let select_query = `SELECT book.book_id as id, isbn_table.title, CONCAT(author.first_name, ' ', author.last_name) as author, isbn_table.format, isbn_table.pages, book.isbn, isbn_table.dewey, book.con FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id WHERE book.book_id=` + req.params.id + ";";

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

	if (!req.params.id) {
		res.send({status: 404});
	}

	// catch the case where the framework sends undefined validation for hidden form page (framework doesn't like how I'm using their forms)
	else if (req.params.id == "undefined") {
		res.send({data: {isbn: undefined}});
		return;
	}

	let sql_query = `SELECT isbn_table.isbn FROM isbn_table WHERE isbn_table.isbn=` + req.params.id + ";";
	console.log("ISBN ASYNC VALIDATION QUERY");
	console.log(req.params.id);
	console.log("undefined");
	console.log(typeof(req.params.id));
	console.log(sql_query);
	console.log();

	connection.query(sql_query, function (err, rows, fields) {
	  if (err) throw err;
	  record = JSON.parse(JSON.stringify(rows))[0];
	  if (record != undefined) {
	  	res.send({data: record});
	  }
	  else {
	  	res.send({status: 404});
	  }
	  
	});

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))