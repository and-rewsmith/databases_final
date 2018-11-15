const express = require('express');
var mysql = require('mysql')
const app = express();
const port = 3001;

app.all('/*', function(req, res, next) {
  // Cors add default headers - this should be changed to only localhost for full deployment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});

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
app.get('/users', (req, res) => {
	connection.connect()

	connection.query('SELECT * FROM book', function (err, rows, fields) {
	  if (err) throw err;

	  res.send(JSON.stringify(rows));
	});

	connection.end();
});

app.get('/users/:id', (req, res) => {
	connection.connect()

	connection.query('SELECT * FROM book WHERE id=' + req.params.id, function (err, rows, fields) {
	  if (err) throw err;

	  res.send(JSON.stringify(rows));
	});

	connection.end();
});

//CREATE
app.post('/users/:id', (req, res) => {
});

//UPDATE
app.put('/users/:id', (req, res) => {
});

//DELETE
app.delete('/users/:id', (req, res) => {
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))