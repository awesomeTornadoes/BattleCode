const mongoDB = 'mongodb://preston:password@ds237947.mlab.com:37947/battlecode';
const mongoose = require('mongoose');

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
    type: String, ref: 'User',
  },
  challenge: {
    type: String, ref: 'Challenge',
  },
});


const Challenge = mongoose.model('Challenge', challengeSchema);
const User = mongoose.model('User', userSchema);
const Game = mongoose.model('Game', gameSchema);


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
  },
  );
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

exports.gameWin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((foundError, suc) => {
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

exports.addFriend = (req, res) => {
  const { userEmail, friend } = req.body;
  User.findOne({ email: friend })
    .then((newFriend) => {
      console.log('found friend', newFriend);
      const friendId = newFriend._id;
      User.findOne({ email: userEmail })
        .then((user) => {
          console.log('found user', user);
          const userFriends = JSON.parse(user.friends);
          userFriends.push(friendId);
          user.friends = JSON.stringify(userFriends);
          user.save();
          res.status(201).send(user);
        })
        .catch(error => res.status(404).send(error));
    })
    .catch(err => res.status(404).send(err));
};
