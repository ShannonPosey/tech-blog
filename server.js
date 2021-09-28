const path = require("path");
const express = require("express");
const sequelize = require("./config/connection");
const exphbs = require("express-handlebars");
const session = require("express-session");

const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
    secret: "I know what you did last summer",
    // secret: process.env.SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001 ;

const routes = require("./controllers");

const helpers = require("./utils/heplers");

const hbs = exphbs.create({helpers});

// Handlebar Template engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "public")));

// turn on routes
app.use(routes);

sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log("App is now listening"));
});
























































// install the following:
// npm install
// - init -y
// - express
// - sequelize
// - mysql2
// - dotenv
// - bcrypt
// - express-handlebars
// - express-session
// - connect-session-sequelize