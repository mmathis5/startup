
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const express = require('express');
const app = express();
const uuid = require('uuid');


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

//log a purchase
apiRouter.post('/log', (req, res) =>{
  const user = req.body.email;
  if (!user){
      res.status(400).send({ msg: 'No user found' });
  }
  const userLogs = logs[user];
  if (!userLogs){
      //create new array
      userLogs = [];
  }
  //pushing into array
  userLogs.push(req.body);  
  logs[user] = userLogs;

  res.status(201).end();
});

//get logs
apiRouter.get('/logs', (req,res) =>{
  //user, connected user in url request. 
  const user = req.query.user;
  const connectedUser = req.query.connectedUser;
  if (!user){
      res.status(400).send({ msg: 'No user found' });
      return;
  }
  //get from logs
  let userLogs = logs[user];
  if (!userLogs){
      userLogs = [];
  }
  let connectedLogs = []
  if (connectedUser & logs[connectedUser]){
      connectedLogs = logs[connectedUser];
  }
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
    msg: "connection created successfully",
    connections: {
      [user]: reqUser,
      [reqUser]: user
    }
  });

});