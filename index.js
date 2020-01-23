let express = require("express");
let cors = require("cors");

const app = express();
const bodyParser = require("body-parser");

let PropertiesReader = require("properties-reader");
let properties = PropertiesReader("server.properties");

const port = properties.get("server.port.number");
const serverName = properties.get("server.port.name");

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

app.use(require('./routes/api/userController'));

app.listen(port, serverName, function() {
    console.log("Server is running on " + port + " port");
});