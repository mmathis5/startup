const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const uuid = require('uuid');
const DB = require('./database.js');

const authCookieName = 'token';

//service port
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

//for tracking and authenticating tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.use(express.static('public'));


// // The scores and users are saved in memory and disappear whenever the service is restarted.
// let users = {};
// let connections = {};
// let logs = {}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'A user already exists under this email. Please login.' });
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);

    res.send({ token: user.token });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: "Error: Invalid username or password." });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', (req, res) => {
  res.clearCookie(authCookieName);
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

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});