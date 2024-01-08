const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
var groupbuying = express.Router();

groupbuying.use(bodyParser.json());
groupbuying.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1234',
  database:'appdata'
});

groupbuying.get('/fetchall', (req, res) => {
  connection.query('SELECT * from groupbuyings', (error, results, fields) => {
      if(error) throw error;
      res.statusCode = 200;
      res.send(results);
      console.log(results);
  });
});

groupbuying.post('/creategroupbuying', async (req, res) => {
  console.log(req.body);
  var groupbuyingpost = {
      id: req.body.id,
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      member: req.body.member
  }
      
  await connection.query(`INSERT INTO groupbuyings (email, title, content, image, member) VALUES ("${groupbuyingpost.email}", "${groupbuyingpost.title}", "${groupbuyingpost.content}", "${groupbuyingpost.image}", "${room.member}");`, (error, result, fields) => {
      groupbuyingpost.id = result.insertId;
      res.statusCode = 201;
      res.setHeader('Content-Type', 'text/json');
      res.json(groupbuyingpost);
  });
});

groupbuying.delete('/deletegroupbuying/:rid', async (req, res) => {
  await connection.query(`DELETE FROM groupbuyings WHERE id = ${req.params.rid}`, (error, result, fields) => {
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
