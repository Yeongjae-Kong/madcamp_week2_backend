const express = require('express');
const mysql= require('mysql');
const bodyParser = require('body-parser');

const participateRouter = express.Router();
participateRouter.use(bodyParser.json());
participateRouter.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'appdata'
});

participateRouter.get('/fetchall', (req, res) => {
    connection.query('SELECT * from participate', (error, results, fields) => {
        if(error) throw error;
        res.statusCode = 200;
        res.send(results);
        console.log(results);
    });
});


participateRouter.post('/createparticipate', async (req, res) => {
    console.log(req.body);
    var participate = {
        p_id: req.body.p_id,
        user: req.body.user,
        room: req.body.room,
        join_time: req.body.join_time
        }
        
    await connection.query(`INSERT INTO participate (user, room, join_time) VALUES ("${participate.user}", "${participate.room}", "${participate.join_time}");`, (error, result, fields) => {
        participate.p_id = result.insertId;
        res.statusCode = 201;
        res.setHeader('Content-Type', 'text/json');
        res.json(participate);
    });
});

participateRouter.delete('/deleteparticipate/:pid', async (req, res) => {
    await connection.query(`DELETE FROM participate WHERE p_id = ${req.params.pid}`, (error, result, fields) => {
        console.log(`participate delete result`);
        console.log(result);
        console.log(req.params.pid);
        res.statusCode = 203;
        res.send(`Participate Id ${req.params.pid} deleted`);
    });
});

module.exports = participateRouter;