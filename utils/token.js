const jwt = require('jsonwebtoken');
var PropertiesReader = require("properties-reader");
var properties = PropertiesReader("server.properties");

// check jwt token
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        if(token) {
          jwt.verify(token, properties.get("token.secret"), (err, decyptedToken) =>{      
            if (err) {
              return res.json({ message: 'invalid token' });    
            } else {
              req.token = token;
              req.email = decyptedToken.email;    
              next();
            }
          });
        }
    } else {
        res.sendStatus(403)
    }
  }

  module.exports = checkToken;