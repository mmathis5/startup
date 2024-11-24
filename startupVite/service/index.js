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

//log a purchase
apiRouter.post('/log', async (req, res) =>{
  const user = req.body.user;
  if (!user){
      res.status(400).send({ msg: 'No user found' });
      return;
    }
  if (!req.body.amount || !req.body.purchase){
    res.status(400).send({msg: "Please complete form before submitting"});
    return;
  }
  try {
    await DB.logPurchase(user, req.body);
    res.status(201).send({ msg: 'Purchase logged successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'An error occurred while logging the purchase.' });
  }
});

//get logs
apiRouter.get('/logs', async (req, res) => {
  const { user, connectedUser } = req.query;
  if (!user) {
    res.status(400).send({ msg: 'No user provided.' });
    return;
  }
  const logs = await DB.getLogs(user, connectedUser);
  res.send(logs);
});

//get connected user
apiRouter.get('/connectedUser', async (req, res) => {
  const user = req.query.user;
  if (!user) {
    res.status(400).send({ msg: 'No user provided' });
    return;
  }
  const userExists = await DB.getUser(user);
  if (!userExists){
    res.status(400).send({msg: "The current user doesn't appear in our system. Please log out and login again."});
    return;
  }
  else{  
    const connectedUser = await DB.getConnectedUser(user);
    res.status(200).send({ connectedUser });
}
});

//connect a user
apiRouter.post('/connect', async (req,res) =>{
  //user, requested connection in url request.
  const user = req.body.user;
  const reqUser = req.body.reqUser;
  const userExists = await DB.getUser(user);
  const reqUserExists = await DB.getUser(reqUser);
  if (!user){
    res.status(400).send({msg: "No user found"})
    return;
  }
  if (!reqUser){
    res.status(400).send({msg: "Please enter a user you wish to connect with."})
    return;
  }
  //check if the current user is already connected to someone
  if (await DB.getConnectedUser(user)) {
    res.status(400).send({msg: 'You are already connected to a user.'})
    return;
  }
  if (!reqUserExists){
    res.status(400).send({msg: "Your requested user does not exist in our system"})
    return;
  }
  if (!userExists){
    res.status(400).send({msg: "The current user doesn't appear in our system. Please log out and login again."});
    return;
  }
  if (await DB.getConnectedUser(reqUser)){
    res.status(400).send({msg: "The user you are trying to connect to is already connected to someone. Please choose another user to connect with."})
    return;
  }
  //create connections for both 
  await DB.createConnection(user, reqUser);
  res.status(200).send({ msg: 'Connection created successfully.' });
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});