var express = require("express");
var app = express();
var path = require("path");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var keys = require("./key");
//var cookieSession = require("cookie-session");
var db = require("./server");
var User = require("./models/user");
const { use } = require("passport");
const { table } = require("console");
const middleware = require("./middleware")
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const config = require('./middleware/passport/config')
const mySocket= require("./socket-config")
const http = require("http");
//const loginConfig = require('./middleware/passport/loginConfig')(passport)


app.use(cookieParser('TVA'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
const router = require('./router/userRouter')
const facutyRouter = require('./router/facutyRouter')
var flagLogin= true;

var user={};

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use('/', router)
app.use('/', facutyRouter)


app.use(
  session({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);



app.get("/", middleware.requireLogin ,(req, res) => {
  // let user = req.user
  
  res.render("/");
});




app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

const server = http.createServer(app);

mySocket.inializeIO(server).on("connection", (socket) => {
  socket.on("disconnect", (socket) => {});
});

const port = process.env.port || 8080;
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
