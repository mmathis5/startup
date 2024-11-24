const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);



// const port = process.argv.length > 2 ? process.argv[2] : 4000;
// const express = require('express');
// const app = express();
// const uuid = require('uuid');


app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = {};
let connections = {};
let logs = {}

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  var user = users[req.body.email];
  if (user) {
    res.status(409).send({ msg: 'A user already exists under this email. Please login.' });
  } else {
    var user = { email: req.body.email, password: req.body.password, token: uuid.v4() };
    users[user.email] = user;

    res.send({ token: user.token });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = users[req.body.email];
  if (user) {
    if (req.body.password === user.password) {
      user.token = uuid.v4();
      res.send({ token: user.token });
      return;
    }
  }
  res.status(401).send({ msg: "Error: Invalid username or password." });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', (req, res) => {
  const user = Object.values(users).find((u) => u.token === req.body.token);
  if (user) {
    delete user.token;
  }
  res.status(204).end();
});

//get connected user
apiRouter.get('/connectedUser', (req, res) => {
  const user = req.query.user;

  if (!user) {
    res.status(400).send({ msg: 'No user provided' });
    return;
  }
  if (!connections[user]){
    return;
  }
  else{  
    const connectedUser = connections[user];
    res.status(200).send({ connectedUser });
}
});

//log a purchase
apiRouter.post('/log', (req, res) =>{
  const user = req.body.user;
  if (!user){
      res.status(400).send({ msg: 'No user found' });
      return;
    }
  if (!req.body.amount){
    res.status(400).send({msg: "Please complete form before submitting"});
    return;
  }
  if (!req.body.purchase){
    res.status(400).send({msg: "Please complete form before submitting"});
    return;
  }
  if (!logs[user]){
      //create new array
      logs[user] = [];
  }
  //pushing into array
  logs[user].push(req.body);  
  res.status(201).send({msg: "Purchase Logged successfully"});
});

//get logs
apiRouter.get('/logs', (req, res) => {
  // Extract user and connectedUser from query parameters
  const user = req.query.user;
  const connectedUser = req.query.connectedUser;

  if (!user) {
    res.status(400).send({ msg: 'No user found' });
    return;
  }

  // Get logs for the user
  let userLogs = logs[user] || []; // Default to empty array if no logs for user

  // Get logs for the connected user if available
  let connectedLogs = [];
  if (connectedUser && logs[connectedUser]) {
    connectedLogs = logs[connectedUser];
  }
  // Combine and send logs
  res.send(userLogs.concat(connectedLogs));
});


//connect a user
apiRouter.post('/connect', (req,res) =>{
  //user, requested connection in url request.
  const user = req.body.user;
  const reqUser = req.body.reqUser;
  const userExists = users[user];
  const reqUserExists = users[reqUser];
  if (!userExists){
    res.status(400).send({meg: "No user found"})
    return;
  }
  if (!reqUserExists){
    res.status(400).send({msg: "Please enter a user you wish to connect with."})
    return;
  }
  //check if the current user is already connected to someone
  const userConnection = connections[user];
  const reqUserConnection = connections[reqUser]
  if (userConnection) {
    res.status(400).send({msg: 'You are already connected to a user.'})
    return;
  }
  if (reqUserConnection){
    res.status(400).send({msg: "The user you are trying to connect to is already connected to someone. Please choose another user to connect with."})
    return;
  }
  //create connections for both 
  connections[user] = reqUser;
  connections[reqUser] = user;

  res.status(200).send({
    msg: "Connection created successfully",
    connections: {
      [user]: reqUser,
      [reqUser]: user
    }
  });

});