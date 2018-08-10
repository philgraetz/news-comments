// == express =================================================
express = require("express");
var bodyParser = require("body-parser");

var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static directory to be served
app.use(express.static("public"));
// app.use("/public/assets/", express.static(path.join(__dirname, "/public/assets/")));
// =============================================================

// === handlebars ==============================================
var exphbs = require('express-handlebars');
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// =============================================================

require('./controllers/routes')(app);

app.listen(PORT, function() {
    console.log("Listening on PORT " + PORT);
});

