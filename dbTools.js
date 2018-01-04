const mongoDB = 'mongodb://preston:password@ds237947.mlab.com:37947/battlecode';
const mongoose = require('mongoose');
const Pusher = require('pusher');

require('dotenv').config();

mongoose.connect(mongoDB, {
  useMongoClient: true,
}, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('connected to', mongoDB);
  }
});

const pusher = new Pusher({
  appId: '452960',
  key: 'c4b754fe17b65799b281',
  secret: '24c88ff32ea02f8c0fe8',
  cluster: 'us2',
  encrypted: true,
});

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: String,
  email: String,
  friends: String,
});

const challengeSchema = new Schema({
  name: String,
  description: String,
  tests: Object,
});

const gameSchema = new Schema({
  winner: {
    type: String,
    ref: 'User',
  },
  challenge: {
    type: String,
    ref: 'Challenge',
  },
  time: {
    type: Number,
  },
});

const duelSchema = new Schema({
  challenger: String,
  challenged: String,
  challenge: String,
  challengerTime: Number,
  challengedTime: Number,
  winner: String,
  complete: Boolean,
});

const Challenge = mongoose.model('Challenge', challengeSchema);
const User = mongoose.model('User', userSchema);
const Game = mongoose.model('Game', gameSchema);
const Duel = mongoose.model('Duel', duelSchema);

exports.makeChallenge = (req, res) => {
  Challenge.find({
    name: req.body.name,
  }).exec((notFound, found) => {
    if (found.length > 0) {
      res.status(200).send('already exists');
    } else {
      Challenge.create(req.body, (err, made) => {
        if (err) {
          res.send(err);
        } else {
          res.status(201).send(made);
        }
      });
    }
  });
};

exports.returnOneChallenge = (req, res) => {
  Challenge.find({
    _id: req.body.id,
  }).exec((err, found) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send(found);
    }
  });
};

exports.getChallenges = (req, res) => {
  Challenge.find({}).exec((err, challenges) => {
    if (err) {
      res.send(err);
    } else {
      res.send(challenges);
    }
  });
};

exports.getChallengeById = (req, res) => {
  Challenge.findOne(req.query).exec((err, success) => {
    if (err) {
      res.send(err);
    } else {
      res.send(success);
    }
  });
};

exports.findUser = (dataObject, cb) => {
  User.findOne(dataObject).exec((err, success) => {
    if (err) {
      cb(err);
    } else {
      if (!success) {
        User.create({
          username: dataObject.email,
          email: dataObject.email,
          friends: JSON.stringify([]),
        }, (err2, instance) => cb(instance));
      } else {
        cb(success);
      }
    }
  });
};

exports.findUserById = (req, res) => {
  User.findOne(req.query).exec((err, success) => {
    if (err) {
      res.send(err);
    } else {
      res.send(success);
    }
  });
};
exports.findUserByEmail = (req, res) => {
  User.findOne(req.query).exec((err, success) => {
    if (err) {
      res.send(err);
    } else {
      res.send(success);
    }
  });
};

exports.gameWin = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((foundError, suc) => {
    if (foundError) {
      res.send(foundError);
    } else {
      Game.find({
        winner: suc._id,
        challenge: req.body.gameId,
      }).exec((err, found) => {
        if (err) {
          res.send(err);
        } else if (found.length === 0) {
          Game.create({
            winner: suc._id,
            challenge: req.body.gameId,
            time: req.body.time,
          }, (err2, instance) => {
            err2 ? console.error(err) : console.log('saved', instance);
          });
        }
      });
    }
    res.send('challenge saved');
  });
};

exports.getGameWinners = (req, res) => {
  Game.find({}).exec((err, games) => {
    if (err) {
      res.send(err);
    } else {
      res.send(games);
    }
  });
};
exports.getUserGame = (req, res) => {
  Game.find(req.query).exec((err, games) => {
    if (err) {
      res.send(err);
    } else {
      res.send(games);
    }
  });
};


exports.addFriend = (req, res) => {
  const { userEmail, friend } = req.body;
  User.findOne({ email: friend })
    .then((newFriend) => {
      const friendId = newFriend.username;
      User.findOne({ email: userEmail })
        .then((user) => {
          const userFriends = JSON.parse(user.friends);
          if(!userFriends.includes(newFriend)) {
            userFriends.push(friendId);
            user.friends = JSON.stringify(userFriends);
            user.save();
            res.status(201).send(user);
          } else {
            res.status(400).send('You\'re already friends with that person!');
          }
        })
        .catch(error => res.status(404).send(error));
    })
    .catch(err => res.status(404).send(err));
};

exports.getFriends = (req, res) => {
  const email = req.headers.user;
  User.findOne({ email })
    .then(user => res.status(200).send(user.friends))
    .catch(err => res.status(404).send(err));
};

exports.createDuel = (req, res) => {
  Challenge.find({})
    .then((challenges) => {
      const challenge = challenges[Math.floor(Math.random() * challenges.length)]._id;
      const { challenger, challenged } = req.body;
      const duel = new Duel({ challenger, challenged, challenge, complete: false });
      duel.save()
        .then(() => {
          pusher.trigger(challenged, 'duel-event', { message: `You've been challenged by ${challenger}!` });
          res.status(201).send(duel);
        })
        .catch(err => res.status(500).send(err));
    });
};

exports.getDuels = (req, res) => {
  const { user } = req.headers;
  Duel.find({ challenged: user })
    .then(duel => res.status(200).send(duel))
    .catch(err => res.status(404).send(err));
};

exports.updateDuel = (req, res) => {
  const {
    duelId,
    email,
    time,
  } = req.body;
  Duel.findOne({ _id: duelId })
    .then((duel) => {
      if (email === duel.challenger) {
        duel.challengerTime = time;
      }
      if (email === duel.challenged) {
        duel.challengedTime = time;
        duel.complete = true;
      }
      if (duel.challengerTime && duel.challengedTime) {
        duel.winner = duel.challengerTime < duel.challengedTime ? duel.challenger : duel.challenged;
        pusher.trigger(duel.challenged, 'duel-complete', { message: `Your challenge with ${duel.challenger} is complete! The winner is ${duel.winner}` });
        pusher.trigger(duel.challenger, 'duel-complete', { message: `Your challenge with ${duel.challenged} is complete! The winner is ${duel.winner}` });
      }
      duel.save();
      res.status(204).send(duel);
    })
    .catch(err => res.status(500).send(err));
};

exports.getUserWins = (req, res) => {
  const { user } = req.headers;
  Duel.find({ winner: user })
    .then(duels => res.status(200).send(duels))
    .catch(err => res.status(404).send(err));
};
