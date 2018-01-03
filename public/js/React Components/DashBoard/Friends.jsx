import React, { Component } from 'react';
import axios from 'axios';

export default class Friends extends Component {
  constructor() {
    super();
    this.state = {
      FriendsList: [],
    };
  }
  componentWillMount() {
  }

  render() {
    const FriendsList = this.state.FriendsList.map((e, i) => (
      <li key={e[0]} className="FriendsList" />
    ));
    return (
      <div className="DashBoardThird">
        <div className="ListTitle">
          <h1> Friends </h1>
        </div>
        <div className="AddFriends">
          <form>
            Add a friend by entering their email here:
            <input type="text" placeholder="example@gmail.com" /><span><br /></span>
            <button className="btn btn-primary" type="submit" value="Submit">Add friend</button>
          </form>
        </div>
        <ul className="DashBoardList">
          {FriendsList}
        </ul>
      </div>
    );
  }
}
