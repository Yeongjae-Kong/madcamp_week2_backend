const express = require('express');
const mysql= require('mysql');
const bodyParser = require('body-parser');

const roomRouter = express.Router();
roomRouter.use(bodyParser.json());
roomRouter.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'appdata'
});

roomRouter.get('/fetchall', (req, res) => {
    connection.query('SELECT * from rooms', (error, results, fields) => {
        if(error) throw error;
        res.statusCode = 200;
        res.send(results);
        console.log(results);
    });
});

roomRouter.post('/createroom', async (req, res) => {
    console.log(req.body);
    var room = {
        r_id: req.body.r_id,
        room_name: req.body.room_name,
        description: req.body.description,
        opener: req.body.opener,
        open_time: req.body.open_time,
        max_participants: req.body.max_participants
    }
        
    await connection.query(`INSERT INTO rooms (room_name, description, opener, open_time, max_participants) VALUES ("${room.room_name}", "${room.description}", "${room.opener}", "${room.open_time}", "${room.max_participants}");`, (error, result, fields) => {
        room.r_id = result.insertId;
        res.statusCode = 201;
        res.setHeader('Content-Type', 'text/json');
        res.json(room);
    });
});

roomRouter.delete('/deleteroom/:rid', async (req, res) => {
    await connection.query(`DELETE FROM rooms WHERE r_id = ${req.params.rid}`, (error, result, fields) => {
        console.log(result);
        console.log(req.params.rid);
        if(result.affectedRows === 0) {
            res.statusCode = 404;
            res.send(`Room Id ${req.params.rid} Not Found`);
        } else {
            res.statusCode = 203;
            res.send(`Room Id ${req.params.rid} deleted`);
        }
    });
});

module.exports = roomRouter;