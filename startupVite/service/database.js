const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfg.json');

console.log(config);
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const connectionsCollection = db.collection('connections');
const logsCollection = db.collection('logs');

(async function testConnection() {
    await client.connect();
    await db.command({ ping: 1 });
  })().catch((ex) => {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  });


function getUser(email){
    console.log("Get User by Email in DB")
    userFound = userCollection.findOne({email: email});
    console.log("User Found "+userFound);
    return userFound;
}

function getUserByToken(token){
    return userCollection.findOne({token: token});
}

async function createUser(email, password){
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        email: email,
        password: passwordHash,
        token: uuid.v4(),
    };
    await userCollection.insertOne(user);
    return user;
}

function getConnectedUser(user){
    return connectionsCollection.findOne({user});
}

async function logPurchase(user, purchase){
    await logsCollection.insertOne({user, ...purchase});
}

async function getLogs(user, connectedUser = null){
    const logs = await logsCollection.find({
        $or: [{ user }, { user: connectedUser }],
      }).toArray();
      return logs;
}

async function createConnection(user, reqUser){
    await connectionsCollection.insertMany([
        { user, connectedUser: reqUser },
        { user: reqUser, connectedUser: user },
      ]);
}



module.exports = {
    getUser,
    getUserByToken,
    createUser,
    logPurchase,
    getLogs,
    createConnection,
    getConnectedUser,
  };
  