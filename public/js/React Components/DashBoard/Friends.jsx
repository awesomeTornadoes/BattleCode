import React, { Component } from 'react';
import axios from 'axios';

export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FriendsList: [],
      friendInput: '',
    };
    this.handleInput = this.handleInput.bind(this);
    this.addFriend = this.addFriend.bind(this);
  }
  componentWillMount() {
    axios.get('/getFriends', { headers: { user: this.props.user } })
      .then((response) => {
        console.log(response.data);
        if (response.data.friends) {
          this.setState({ FriendsList: JSON.parse(response.data.friends) });
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
      .then(data => console.log(data));
  }

  render() {
    let FriendsList;
    if (this.state.FriendsList[0]) {
      FriendsList = this.state.FriendsList.map((e, i) => (
        <li key={e[i]} className="FriendsList" />
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
