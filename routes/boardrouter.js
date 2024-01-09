const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
var boardRouter = express.Router();

boardRouter.use(bodyParser.json());
boardRouter.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'appdata'
});

boardRouter.get('/fetchall', (req, res) => {
  connection.query('SELECT * from boards', (error, results, fields) => {
      if(error) throw error;
      res.statusCode = 200;
      res.send(results);
      console.log(results);
  });
});

boardRouter.post('/createboard', async (req, res) => {
  console.log(req.body);
  var board = {
      id: req.body.id,
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image
  }
      
  connection.query(`INSERT INTO boards (email, title, content, image) VALUES (?, ?, ?, ?);`,
    [board.email, board.title, board.content, board.image, board.member],
    (error, result, fields) => {
      if (error) {
            console.error(error);
            res.status(500).send('Database Error');
            return;
        }
        board.id = result.insertId;
        console.log(board.id);
        res.status(201).json(board);
  });
});

boardRouter.delete('/deleteboard/:rid', async (req, res) => {
  connection.query(`DELETE FROM boards WHERE id = ${req.params.rid}`, (error, result, fields) => {
      console.log(result);
      console.log(req.params.rid);
      if(result.affectedRows === 0) {
          res.statusCode = 404;
          res.send(`board Id ${req.params.rid} Not Found`);
      } else {
          res.statusCode = 203;
          res.send(`board Id ${req.params.rid} deleted`);
      }
  });
});

module.exports = boardRouter;