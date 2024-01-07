const express = require('express');
const mysql= require('mysql2');
const bodyParser = require('body-parser');
var userRouter = express.Router();

userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'appdata'
  });

userRouter.get('/fetchall', (req, res) => {
    connection.query('SELECT * from users', (error, results, fields) => {
        if(error) throw error;
        res.statusCode = 200;
        res.send(results);
        console.log(results);
    });
});

userRouter.post('/createuser', async (req, res) => {
    console.log(req.body);
    var user = {
        u_id: req.body.u_id,
        room: req.body.room,
        email: req.body.email,
        password: req.body.password
    };

    connection.query(`INSERT INTO users (room, email, password) VALUES (?, ?, ?);`,
        [user.room, user.email, user.password],
        (error, result, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Database Error');
                return;
            }
            user.u_id = result.insertId;
            console.log(user.u_id);
            res.status(201).json(user);
        }
    );
});

userRouter.put('/updateuser', async (req, res) => {
    console.log(req.body);
    var user = {
        u_id: req.body.u_id,
        room: req.body.room,
        email: req.body.email,
        password: req.body.password}

    await connection.query(`UPDATE users SET room='${user.room}', email='${user.email}', password='${user.password}' WHERE u_id = ${user.u_id}`, (error, result, fields) => {
        console.log(result);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');
        res.json(user);
    });
});


module.exports = userRouter;