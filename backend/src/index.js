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

  //req.header("Access-Control-Allow-Origin", )

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
//GET_MANY_REFERENCE: ?filter={author_id:345
app.get('/admin/books', (req, res) => {
	// connection.connect()

	// connection.query('SELECT * FROM book', function (err, rows, fields) {
	//   if (err) throw err;

	//   res.send({data: rows});
	// });

	// connection.end();

	// console.log("BOOM");

	// if (req.query.sort == null) {
	// 	res.send({
	// 	    data: [{ id: 123, title: "hello, world!" }]
	// 	});
	// }
	// else {
	// 	res.send({
	// 	    data: [{ id: 123, title: "hello, world!" }],
	// 	    total: 1
	// 	});
	// }

	res.send([{ id: 123, title: "hello, world!" }]);


});

app.get('/admin/books/:id', (req, res) => {
	connection.connect()

	// connection.query('SELECT * FROM book WHERE id=' + req.params.id, function (err, rows, fields) {
	//   if (err) throw err;

	//   res.send(JSON.stringify(rows));
	// });

	connection.end();

	res.send({
	    data: { id: 123, title: "hello, world!" }
	});

});

//CREATE
app.post('/admin/books', (req, res) => {
	// connection.connect()

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
app.put('/admin/books/:id', (req, res) => {
	res.send({
	    data: { id: 123, title: "hello, world!" }
	});
});

//DELETE
app.delete('/admin/books/:id', (req, res) => {
	res.send({
	    data: { id: 123, title: "hello, world!" }
	});
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))