
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const express = require('express');
const app = express();

app.use(express.static('public'));


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = {};
let scores = [];
let logs = {}

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

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

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  const user = users[req.body.email];
  if (user) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = { email: req.body.email, password: req.body.password, token: uuid.v4() };
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
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', (req, res) => {
  const user = Object.values(users).find((u) => u.token === req.body.token);
  if (user) {
    delete user.token;
  }
  res.status(204).end();
});

// GetScores
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// SubmitScore
apiRouter.post('/score', (req, res) => {
  scores = updateScores(req.body, scores);
  res.send(scores);
});


// updateScores considers a new score for inclusion in the high scores.
function updateScores(newScore, scores) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}
