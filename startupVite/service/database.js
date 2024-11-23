const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfg.json');


const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('simon');
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
    return userCollection.findOne({email: email});
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
    await userCollection.inertOne(user);
    return user;
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
  };
  