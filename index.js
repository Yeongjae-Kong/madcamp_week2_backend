const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');
const mysql= require('mysql2');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'appdata'
});

const app = express();
app.use(express.json());

/////////////////////////////////////////////////////////////////////

const userRouter = require('./routes/userrouter');
app.use('/user', userRouter);

const roomRouter = require('./routes/roomrouter');
app.use('/room', roomRouter);

const participateRouter = require('./routes/participaterouter');
app.use('/participate', participateRouter);

const messageRouter = require('./routes/messagerouter');
app.use('/message', messageRouter);

const profilePicRouter = require('./routes/profilepicrouter');
app.use('/profilepic', profilePicRouter);

/////////////////////////////////////////////////////////////////////


connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

app.listen(80, () => {
    console.log('Server started at port 80');
});




// connection.query('INSERT into users VALUES (0, "User1", "Salutations!", "", "user1@salutations.com", "", "2022/07/08");', (error, results, fields) => {
//   if(error) throw error;
//   console.log(results);
// });

// connection.query('SELECT * from rooms', (error, results, fields) => {
//     if(error) throw error;
//     console.log(results);
// });

// connection.query('SELECT * from participate', (error, results, fields) => {
//     if(error) throw error;
//     console.log(results);
// });

// connection.query('SELECT * from messages', (error, results, fields) => {
//     if(error) throw error;
//     console.log(results);
// });

// connection.end();











