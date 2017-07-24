
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const multer = require("multer");
const _ = require("lodash");
const moment = require("moment");

require("./server_config/config");

const { mongoose } = require("./db/mongoose");
const { Door } = require("./models/Door");
const { User } = require("./models/User");

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);


const port = process.env.port;

app.use(bodyParser.json());

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

io.on("connection", socket => {
  socket.on("disconnect", () => {
  });
});

/*
app.get("/", (req, res) => {
  res.send("<h1>Security System</h1>");
});
*/

//login for desctop app
app.post("/login", (req, res) => {
  lol = {
    username: req.body.login,
    password: req.body.password
  };
  res.send({ token: "Token" });
});

//create new user
app.post("/user/new", (req, res) => {
  var user = new User({
    name: req.body.name,
    accessLevel: req.body.accessLevel,
    cardUuid: req.body.cardUuid
  });
  user.save().then(
    doc => {
      res.send(doc);
    },
    err => {
      res.status(400).send(err);
    }
  );
});
//create new door
app.post("/door/new", (req, res) => {
  var door = new Door({
    place: req.body.place,
    accessLevel: req.body.accessLevel,
    macAdress: req.body.macAdress
  });
  door.save().then(
    doc => {
      res.send(doc);
    },
    err => {
      res.status(400).send(err);
    }
  );
});

//get info about all users
app.get("/users", (req, res) => {
  User.find().then(
    data => {
      res.send(data);
    },
    e => {
      res.status(400).send(e);
    }
  );
});
//get info about all doors
app.get("/doors", (req, res) => {
  Door.find().then(
    data => {
      res.send(data);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

//api for iskrajs lock
app.post("/doorsapi", (req, res) => {
  var user = null;
  var door = null;

  Door.find({
    macAdress: req.body.macAdress
  }).then(
    doorData => {
      if (doorData.length > 0) {
        door = doorData;
      } else {
        io.emit("message", {
          type: "new-message",
          status: 400,
          text: `Cant find door with mac-adress: ${req.body.macAdress}`,
          time: `${moment().format("DD MMM LTS")}`
        });
        res.send({
          status: 400,
          text: `Cant find door with mac-adress: ${req.body.macAdress}`
        });
      }
    },
    e => {
      res.status(400).send({ status: 400 });
    }
  );

  User.find({
    cardUuid: req.body.cardUuid
  }).then(
    userData => {
      if (userData.length > 0) {
        user = userData;
        if (user[0].accessLevel >= door[0].accessLevel) {
          io.emit("message", {
            type: "new-message",
            status: 200,
            text: `User ${user[0].name} get access to ${door[0].place}.`,
            time: `${moment().format("DD MMM LTS")}`
          });
          res.send({ status: 200 });
        } else {
          io.emit("message", {
            type: "new-message",
            status: 400,
            text: `User ${user[0].name} try get access to ${door[0].place}.`,
            time: `${moment().format("DD MMM LTS")}`
          });
          res.send({ status: 400 });
        }
      } else {
        io.emit("message", {
          type: "new-message",
          status: 400,
          text: `Unauthorized access try at ${door[0].place} !`,
          time: `${moment().format("DD MMM LTS")}`
        });
        res.send({
          status: 400,
          text: `Unauthorized access try in ${door[0].place} !`,
        });
      }
    },
    e => {
      res.status(400).send({ status: 400 });
    }
  );
});
http.listen(port, () => {
  console.log(`All working on ${port}`);
});