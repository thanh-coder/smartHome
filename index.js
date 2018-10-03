const express = require("express");
const session = require('express-session');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const routes = require('./routes/index.route');

const userModel = require('./model/user.model');
mongoose.connect('mongodb://localhost/arduino');

app.set("view engine","pug");
app.set("views","./views");

app.use(session( {secret: 'lmintsecret', resave: true, saveUninitialized: false} ));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

passport.use(new localStrategy(
  async (username, password, done) => {
    const user = await userModel.findOne({ username: username });
    if(user && user.password == password) { return done(null, user) }
    else { return done(null, false) }       
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id)
    .then((user) => { done(null, user) })
    .catch((err) => console.log(err));
});

const server = require("http").Server(app); 
// lấy danh sách các phần từ có class active
const socketIO = require('./socket.io/socket-io')(server);

server.listen(port);