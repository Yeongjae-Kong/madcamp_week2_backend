const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
var groupdeliveryRouter = express.Router();

groupdeliveryRouter.use(bodyParser.json());
groupdeliveryRouter.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'appdata'
});

groupdeliveryRouter.get('/fetchall', (req, res) => {
  connection.query('SELECT * from groupdeliverys', (error, results, fields) => {
      if(error) throw error;
      res.statusCode = 200;
      res.send(results);
      console.log(results);
  });
});

groupdeliveryRouter.post('/creategroupdelivery', async (req, res) => {
  console.log(req.body);
  var groupdelivery = {
      id: req.body.id,
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      member: req.body.member,
      duetime: req.body.duetime
  }
      
  connection.query(`INSERT INTO groupdeliverys (email, title, content, image, member, duetime) VALUES (?, ?, ?, ?, ?, ?);`,
    [groupdelivery.email, groupdelivery.title, groupdelivery.content, groupdelivery.image, groupdelivery.member, groupdelivery.duetime],
    (error, result, fields) => {
      if (error) {
            console.error(error);
            res.status(500).send('Database Error');
            return;
        }
        groupdelivery.id = result.insertId;
        console.log(groupdelivery.id);
        res.status(201).json(groupdelivery);
  });
});

groupdeliveryRouter.delete('/deletegroupdelivery/:rid', async (req, res) => {
  connection.query(`DELETE FROM groupdeliverys WHERE id = ${req.params.rid}`, (error, result, fields) => {
      console.log(result);
      console.log(req.params.rid);
      if(result.affectedRows === 0) {
          res.statusCode = 404;
          res.send(`groupdelivery Id ${req.params.rid} Not Found`);
      } else {
          res.statusCode = 203;
          res.send(`groupdelivery Id ${req.params.rid} deleted`);
      }
  });
});

module.exports = groupdeliveryRouter;