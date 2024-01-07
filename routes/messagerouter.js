const express = require('express');
const mysql= require('mysql');
const bodyParser = require('body-parser');

const messageRouter = express.Router();
messageRouter.use(bodyParser.json());
messageRouter.use(bodyParser.urlencoded({extended: false}));


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'appdata'
});

messageRouter.get('/fetchall', (req, res) => {
    connection.query('SELECT * from messages', (error, results, fields) => {
        if(error) throw error;
        res.statusCode = 200;
        res.send(results);
        console.log(results);
    });
});


messageRouter.post('/createmessage', async (req, res) => {
    console.log(req.body);
    var message = {
        m_id: req.body.m_id,
        room: req.body.room,
        user: req.body.user,
        content: req.body.content,
        send_time: req.body.send_time
        }
        
    connection.query(`INSERT INTO messages (room, user, content, send_time) VALUES ("${message.room}", "${message.user}", "${message.content}", "${message.send_time}");`, (error, result, fields) => {
        message.m_id = result.insertId;
        res.statusCode = 201;
        res.setHeader('Content-Type', 'text/json');
        res.json(message);
    });
});

module.exports = messageRouter;