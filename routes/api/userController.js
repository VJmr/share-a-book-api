const express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let pool = require("../../utils/db-pool");
let formatJson = require("../../utils/json-formatter");
let logger = require("../../utils/logger");

let PropertiesReader = require("properties-reader");
let properties = PropertiesReader("server.properties");

router.post("/api/user/signup", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let start = new Date();
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    let sql = `INSERT INTO public.users(fname, lname, mname, password, email, isactive, isdeleted, createddate, createdby, updateddate, updatedby) 
                VALUES(${req.body.fname}, ${req.body.lname}, ${req.body.mname}, ${hash}, ${req.body.email}, true, false, 
                ${new Date().toISOString().split('T')[0]},'user', ${new Date().toISOString().split('T')[0]}, 'user')`;
    logger.debug(`QUERY: ${sql}`);
    pool.query(sql, (error, response) => {
        let end = new Date();
        logger.debug(
        "Time taken for execution of signup is " +
            Math.abs((end.getTime() - start.getTime()) / 1000)
        );
        if(error) {
            logger.error(sql + "==>" + error);
            res.send({
                message: 'Error in creating the user'
            })
        }
        res.send({
            message: 'User created successfully'
        });
    })
});

router.post("/api/user/signin", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    let start = new Date();
    let sql = `SELECT fname, lname, mname, password, email FROM public.users WHERE email = ${req.body.email} and isactive=true and isdeleted=false`;
    logger.debug(`QUERY: ${sql}`);
    pool.query(sql, (error, response) => {
        let json = formatJson(response);
        let isCorrectPassword = false;
        if(json != undefined && json.length > 0){
            isCorrectPassword = bcrypt.compareSync(req.body.password, json[0].password);
            if(isCorrectPassword) {
              const token = jwt.sign({ email: req.body.username },properties.get("token.secret"),{ expiresIn: '1h' });
              json[0].token= token;
            }
            delete json[0].password;
        }
        let end = new Date();
        logger.debug(
            "Time taken for execution of signin is " +
                Math.abs((end.getTime() - start.getTime()) / 1000)
            );
        if(error) {
            logger.error(sql + "==>" + error);
            res.send({
                message: "User doesn't exist"
            })
        }
        if(isCorrectPassword){
            res.send(json);
        } else {
            res.send([{
                error: 'Incorrect Password'
            }]);
        }
    })
});

module.exports = router;