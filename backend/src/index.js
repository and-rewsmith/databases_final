const express = require('express');
var mysql = require('mysql');
var cors = require('cors');
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

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'Library'
});

app.get('/', (req, res) => res.send('Placeholder'));

// append /admin for our http requests
//app.use("/admin", admin);

//GET_LIST: ?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}
//GET_MANY: ?filter={ids:[123,456,789]}
//GET_MANY_REFERENCE: ?filter={author_id:345}
app.get('/books', (req, res) => {

	if (req.query.range == null) {
		range = [0, 25];
	}
	if (req.query.sort == null) {
		sort = ["book_id", "ASC"];
	}

	let sort = JSON.parse(req.query.sort);
	let range = JSON.parse(req.query.range);
	let filter = JSON.parse(req.query.filter);

	let field = sort[0]
	let order = sort[1];
	let start_index = range[0];
	let max_entries = range[1];

	//Condition is a reserved word so I couldn't make this map well like the other aliases
	if (field == "Condition") {
		field = "Cond";
	}

	let sql_query = `SELECT book.book_id as id, isbn_table.title as Title, CONCAT(author.first_name, ' ', author.last_name) as Author, isbn_table.format as Format, isbn_table.pages as Pages, book.isbn as ISBN, isbn_table.dewey as Dewey, book.con as Cond FROM book INNER JOIN isbn_table on book.isbn=isbn_table.isbn INNER JOIN writes on book.isbn=writes.isbn INNER JOIN author on writes.author_id=author.author_id ORDER BY ${field} ${order} LIMIT ${range[0]}, ${range[1]};`;

	// console.log(sql_query);
	// console.log(sort);
	// console.log(range);
	// console.log(filter);
	// console.log('\n');

	connection.query(sql_query, function (err, rows, fields) {
	  if (err) throw err;
	  rows = JSON.parse(JSON.stringify(rows));
	  res.send(rows);
	});


	//res.send([{ id: 123, title: "hello, world!" }]);


});

app.get('/books/:id', (req, res) => {

	// connection.query('SELECT * FROM book WHERE id=' + req.params.id, function (err, rows, fields) {
	//   if (err) throw err;

	//   res.send(JSON.stringify(rows));
	// });

	res.send({
	    data: { id: 123, title: "hello, world!" }
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
	res.send({
	    data: { id: 123, title: "hello, world!" }
	});
});

//DELETE
app.delete('/books/:id', (req, res) => {
	res.send({
	    data: { id: 123, title: "hello, world!" }
	});
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))