const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const port = 8000;
const mysql = require('mysql');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { registerUser, signUser } = require('./src/user-data');
// const ifaces = require('os').networkInterfaces();

// const localhost = Object.keys(ifaces).reduce((host,ifname) => {
//     let iface = ifaces[ifname].find(iface => !('IPv4' !== iface.family || iface.internal !== false));
//     return iface? iface.address : host;
// }, '127.0.0.1');
// console.log(`${localhost}:${port}`);
app.use(express.static('file'))
// // mysql -P 3306 -h <host> -u <user> -p <name database>
const connection = {
    host: 'lasertroid.ru',
    user: 'a0196269',
    password: 'ucacziubex',
    database: 'a0196269_wor00'
}
const pool = mysql.createPool(connection);

app.set('view engine', 'pug') 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret key'))

app.use('/', (req, res, next) => {  
    if(Boolean(req.body.registration)) {
        registerUser(pool, req.body.login, req.body.password, req.body.email)
        .then(mess => res.json({'type': 'success', 'message': mess}))
        .catch(err => res.json({'type': 'error', 'message': err}))
    } else if(Boolean(req.body.sign)) {
        signUser(pool, req.body.login, req.body.password)
        .then(mess => {
            res.cookie('token', '12345ABCDE', 'login', mess.login, 'email', mess.email, 'id', mess.id)
            res.json({'type': 'success', 'message': 'redirect...'})
        })
        .catch(err => res.json({'type': 'error', 'message': err}))
    } else {
        if(req.cookies.token && req.cookies.token == '12345ABCDE') {
            next()
        } else {
            if(req.originalUrl.indexOf('/api/') == 0) {
                return next()
            }
            res.render('./registers')
        }
    }
    //res.clearCookie('token', '12345ABCDE')
});

require('./app/routes/index')(app, pool, fs);

app.get('/', (req, res, next) => {
    res.render('./portable/layout', {
        title: "Admin Panel"
    });
    next()
})

app.get('/list-users', (req, res, next) => {
    res.render('list-users')
})

app.get('/index', (req, res, next) => {
    res.render('index')
})

app.get('/battl', (req, res, next) => {
    res.render('battl')
})

app.get('/push', (req, res, next) => {
    res.render('push')
})

app.get('/statistic', (req, res, next) => {
    res.render('statistic')
})

app.get('/message', (req, res, next) => {
    res.render('message')
})


app.get('/store', (req, res, next) => {
    res.render('store')
})

app.get('/docs', (req, res, next) => {
    res.render('docs')
})

app.listen(port) 