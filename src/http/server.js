const http = require("http");
const express = require("express");
const initializePassport = require("../passport_js/passport_config");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

/* mysql database creds */
const connection = require("../db/connection");

const connect_to_db = require("../db/connect");
const searchUser = require("../utility_functions/searchUser");
const checkAuth = require("../utility_functions/checkAuth");
const checkNotAuth = require("../utility_functions/checkNotAuth");
const generateRid = require("../utility_functions/generate_room_id");
const signalling_channel = require("../websocket/signalling");

/* setup express sever */
const app = express();
const server = http.createServer(app);

/* connect db */
connect_to_db(connection);

/* setup websocket */
signalling_channel(server);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  "/static/css",
  express.static(path.join(__dirname, "..", "views", "css"))
);
app.use(
  "/static/js",
  express.static(path.join(__dirname, "..", "views", "js"))
);
app.use(express.json());
app.use(flash());
app.use(
  session({
    // key to encrpt
    secret: "secret",
    // resave existing sesson id
    resave: false,
    // save empty session id
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport function call
initializePassport(
  passport,
  async (username) =>
    // getUserByUsername
    await searchUser(username),
  // getUserById
  async (id) => await searchUser(id)
);

// Object which stores info about connected users
var rooms = [];

// endpoints
app.get("/", checkNotAuth, (req, res) => {
  res.redirect("/login");
});

app.get("/login", checkNotAuth, (req, res) => {
  res.sendFile("/views/login.html", { root: path.join(__dirname, "..") });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => {
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
    res.json({ accessToken });
  }
);

app.get("/signup", checkNotAuth, (req, res) => {
  res.sendFile("/views/signup.html", { root: path.join(__dirname, "..") });
});

app.post("/signup", (req, res) => {
  var data = req.body;
  values = [];
  console.log(req.body);
  values.push(data.name);
  values.push(data.username);
  values.push(data.password);
  console.log(values);
  var sql = "INSERT INTO login (name,userid,password) VALUES ?";

  connection.query(sql, [[values]], (err, results) => {
    if (err) res.redirect("/signup");
    console.log("user registered");
    res.redirect("/");
  });
});

app.get("/dashboard", checkAuth, (req, res) => {
  res.sendFile("/views/dash.html", { root: path.join(__dirname, "..") });
});

app.get("/generateRoomId", checkAuth, (req, res) => {
  const rid = generateRid(rooms);
  rooms.push(rid);
  res.redirect(`/${rid}`);
});

app.get("/checkRoomId", checkAuth, (req, res) => {
  const { roomId } = req.query;
  if (rooms.filter((x) => (x == roomId) != 0)) {
    res.redirect(`/${roomId}`);
  } else {
    res.redirect(`/dashboard`);
  }
});

app.get("/:roomId", checkAuth, (req, res) => {
  res.sendFile("/views/room-lobby.html", { root: path.join(__dirname, "..") });
});

app.get("/mail", (req, res) => {
  [url] = req.query;
  res.render("email", { url });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
server.listen(port);
