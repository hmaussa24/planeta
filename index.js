var http = require('http');
var env = require('node-env-file'); // .env file
env(__dirname + '/.env');
var express = require('express');
var morgan = require('morgan')
let mysql = require('mysql');

var PORT = process.env.PORT;
var USER = process.env.USER;
var PASSWORD = process.env.PASSWORD;
var DATABASE = process.env.DATABASE;
var HOST = process.env.HOST;
var app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.disable('x-powered-by');
app.set('port', PORT);
app.use(express.json())


let connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});
app.post('/registro', function (req, resp) {
    let userID = req.body.userID;
    let name = req.body.name;
    let email = req.body.email;
    let picture = req.body.picture;
    connection.query('SELECT email FROM usuarios WHERE email=?', [email], function (err, result, fields) {
        if (err) {
            return res.status(405).json({ 'error': 'Error inesperado intentelo mas trade.' }).send();
        } else {
            if (result[0]) {
                return resp.json({ 'ok': true }).send();
            } else {
                connection.query('INSERT INTO usuarios (userID,name,email,picture) VALUES (?,?,?,?)', [userID, name, email, picture], function (error, result, fields) {
                    if (error) {
                        return resp.status(405).json({ 'error': 'Datos no guardados' }).send();
                    } else {
                        return resp.json({ 'status': true }).send();
                    }
                })
            }
        }
    })

}) //registro.

app.get('/all', function (req, res) {
    connection.query('SELECT * FROM usuarios ORDER BY id DESC', function (err, result, fields) {
        if (err) {
            return res.status(405).json({ 'error': 'Error inesperado intentelo mas trade.' }).send();
        } else {
            if (result) {
                return res.json(result);
            } else {
                return res.json({ 'error': true }).send();
            }
        }
    })
}) //registro.

app.get('/count', function (req, res) {
    connection.query('SELECT count(*) as numero FROM usuarios', function (err, result, fields) {
        if (err) {
            return res.status(405).json({ 'error': 'Error inesperado intentelo mas trade.' }).send();
        } else {
            if (result) {
                return res.json({'result' : result[0]});
            } else {
                return res.json({ 'error': true }).send();
            }
        }
    })
}) //registro.


app.use(morgan('dev'))

app.use(express.static('public'));
http.createServer(app).listen(app.get('port'), function () {
    console.log('Only Devs run in: http://' + process.env.HOST + '/' + app.get('port'));
});