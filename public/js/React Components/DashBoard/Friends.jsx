import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';

export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FriendsList: [],
      wins: [],
      friendInput: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.sendChallenge = this.sendChallenge.bind(this);
  }
  componentWillMount() {
    axios.get('/getFriends', { headers: { user: this.props.user } })
      .then((response) => {
        let FriendsList;
        if (response.data) {
          if (response.data.length > 1) {
            FriendsList = response.data;
          } else {
            FriendsList = [response.data];
          }
          this.setState({ FriendsList });
        }
      });

  }
  handleInput(event) {
    this.setState({ friendInput: event.target.value });
  }
  addFriend() {
    const friend = this.state.friendInput;
    const userEmail = this.props.user;
    axios.post('/addFriend', { friend, userEmail })
      .then(() => {
        axios.get('/getFriends', { headers: { user: userEmail } })
          .then((response) => {
            if (response.data) {
              const FriendsList = [response.data];
              this.setState({ FriendsList });
            }
          });
      });


  }
  sendChallenge(event) {
    const challenger = this.props.user;
    console.log(event.target);
    axios.post('/duel', {
      challenger,
      challenged: event.target.value,
    })
      .then((response) => {
        window.location.hash = `/competition/?id=${response.data.challenge}&duel=${response.data._id}`;
      })
      .catch(err => console.error(err));
    axios.get('/findUserByEmail', {
      params: {
        email: challengee,
      },
    }).then(({ data: user }) => {
      axios.post('/text', { user: window.user.slice(0, window.user.indexOf('@')), phone: '5043430627' })
        .then(res => console.log(res));
    });
  }
  render() {
    let FriendsList;
    if (this.state.FriendsList[0]) {
      FriendsList = this.state.FriendsList.map((e, i) => (
        <li key={e[i]} className="FriendsList">
          <h4>{e}</h4>
          <button
            value={e}
            onClick={this.sendChallenge}
            className="btn btn-primary"
          >Challenge {e}!</button>
        </li>
      ));
    }
    return (
      <div className="DashBoardThird">
        <div className="ListTitle">
          <h1> Friends </h1>
        </div>
        <div className="AddFriends">
          <form>
            Add a friend by entering their email here:<br />
            <input
              type="text"
              placeholder="example@gmail.com"
              value={this.state.friendInput}
              onChange={this.handleInput}
              className="form-control"
            />
            <button
              onClick={this.addFriend}
              className="btn btn-primary"
              type="submit"
              value="Submit"
            >Add friend</button>
          </form>
        </div>
        <ul className="DashBoardList">
          {FriendsList}
        </ul>
      </div>
    );
  }
}

Friends.propTypes = {
  user: PropTypes.string.isRequired,
};
