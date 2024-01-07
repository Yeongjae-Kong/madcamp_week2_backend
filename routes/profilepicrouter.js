const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');


const profilePicRouter = express.Router();
module.exports = profilePicRouter;

profilePicRouter.use(fileUpload({
    createParentPath: true
}));
profilePicRouter.use(cors());
profilePicRouter.use(bodyParser.json());
profilePicRouter.use(bodyParser.urlencoded({extended: true}));
profilePicRouter.use(morgan('dev'));


profilePicRouter.post('/:uid', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            console.log(req.files)
            let avatar = req.files[Object.keys(req.files)[0]];
            avatar.mv(`./userdata/profilepic/${req.params.uid}.jpg`);
            res.status = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.send(`http://192.249.18.152/profilepic/${req.params.uid}`);
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

profilePicRouter.get('/:uid', async (req, res, next) => {
    try {
        var filepath = `userdata/profilepic/${req.params.uid}.jpg`;
        if(fs.existsSync(filepath)) {
            res.sendFile(filepath, { root : process.cwd()});
        } else {
            res.status = 404;
            res.send(`Image ${req.params.uid}.jpg not found`);
        }
    } catch(err) {
        res.status = 500;
        res.send(err);
    }
});