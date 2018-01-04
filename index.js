const express = require('express');

require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./dbTools');
const auth = require('./auth');
const Pusher = require('pusher');
const config = require('./config');
const {notifyOnChallenge} = require('./middleware/twilioNotifications');
const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());


const pusher = new Pusher({
  appId: '452960',
  key: 'c4b754fe17b65799b281',
  secret: '24c88ff32ea02f8c0fe8',
  cluster: 'us2',
  encrypted: true,
});

const port = process.env.PORT || 5000;
app.set('port', port);
const server = app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('listening on port', port);
  }
});
// let users = 0;
// const io = require('socket.io')(server);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('room', (data) => {
    console.log('in joining room in SERVER', data);
    const room = 'alpha';
    // socket.join(room)
    socket.emit('new user join', ['user']);
    // setTimeout(() => {
    //   socket.in('alpha').emit('new user join', data.user)
    // }, 2000);
  });
});

app.post('/signin', (req, res) => {
  auth.tokenCheck(req.body.idtoken, (gUserData) => {
    db.findUser(gUserData, (bcUserProfile) => {
      res.status(200).send(bcUserProfile);
    });
  });
});

app.post('/text', (req, res) => {
  const { user } = req.body;
  notifyOnChallenge(user);
  res.send(user);
});



app.get('/competitions', db.getChallenges);
app.get('/competition', db.getChallengeById);
app.post('/uniquecompetition', db.returnOneChallenge);
app.post('/makechallenge', db.makeChallenge);
app.post('/gamewin', db.gameWin);
app.get('/games', db.getGameWinners);
app.get('/usergames', db.getUserGame);
app.get('/findUserById', db.findUserById);
app.get('/findUserByEmail', db.findUserByEmail);
app.post('/addFriend', db.addFriend);
app.get('/getFriends', db.getFriends);
app.get('/duels', db.getDuels);
app.post('/duel', db.createDuel);
// app.post('/duelUpdate', db.updateDuel);
