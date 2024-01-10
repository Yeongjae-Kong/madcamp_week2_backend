const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
var groupbuyingRouter = express.Router();

groupbuyingRouter.use(bodyParser.json());
groupbuyingRouter.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'appdata'
});

groupbuyingRouter.get('/fetchall', (req, res) => {
  connection.query('SELECT * from groupbuyings', (error, results, fields) => {
      if(error) throw error;
      res.statusCode = 200;
      res.send(results);
      console.log(results);
  });
});

groupbuyingRouter.post('/creategroupbuying', async (req, res) => {
  console.log(req.body);
  var groupbuying = {
      id: req.body.id,
      email: req.body.email,
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      member: req.body.member
  }
  
      
  connection.query(`INSERT INTO groupbuyings (email, title, content, image, member) VALUES (?, ?, ?, ?, ?);`,
    [groupbuying.email, groupbuying.title, groupbuying.content, groupbuying.image, groupbuying.member],
    (error, result, fields) => {
      if (error) {
            console.error(error);
            res.status(500).send('Database Error');
            return;
        }
        groupbuying.id = result.insertId;
        console.log(groupbuying.id);
        res.status(201).json(groupbuying);
  });
});

groupbuyingRouter.put('/updategroupbuying/:rid', (req, res) => {
  const rid = req.params.rid;
  var groupbuying = {
    email: req.body.email,
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    member: req.body.member
  };

  connection.query(`UPDATE groupbuyings SET email=?, title=?, content=?, image=?, member=? WHERE id=?;`,
    [groupbuying.email, groupbuying.title, groupbuying.content, groupbuying.image, groupbuying.member, rid],
    (error, result, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send('Database Error');
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).send('GroupBuying not found');
      } else {
        res.status(200).json({ id: rid, ...groupbuying });
      }
  });
});

groupbuyingRouter.delete('/deletegroupbuying/:rid', async (req, res) => {
  connection.query(`DELETE FROM groupbuyings WHERE id = ${req.params.rid}`, (error, result, fields) => {
      console.log(result);
      console.log(req.params.rid);
      if(result.affectedRows === 0) {
          res.statusCode = 404;
          res.send(`groupbuying Id ${req.params.rid} Not Found`);
      } else {
          res.statusCode = 203;
          res.send(`groupbuying Id ${req.params.rid} deleted`);
      }
  });
});

module.exports = groupbuyingRouter;