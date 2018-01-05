import React, { Component } from 'react';
import { blue300 } from 'material-ui/styles/colors';
import { red300 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import { white } from 'material-ui/styles/colors';
import axios from 'axios';

export default class Badges extends Component {
  constructor() {
    super();
    this.state = {
      badges: '',
      n: '',
    };
  }

  componentWillMount() {
    axios.get('/findUserByEmail', {
      params: {
        email: window.user,
      },
    }).then(({ data: user }) => {
      axios.get('/usergames', {
        params: {
          winner: user._id,
        },
      }).then(({ data: games }) => {
        this.setState({
          badges: games.length * 4,
          n: this.state.badges > 3 ? 2 : 1,
        });
      });
    });
  }

  render() {
    const avatar1 = (
      <Avatar
        color={white}
        backgroundColor={blue300}
        size={50}
      >
        J
      </Avatar>
    );
    const avatar2 = (
      <Avatar
        color={white}
        backgroundColor={red300}
        size={50}
      >
        S
      </Avatar>
    );
    const avatars = [avatar1, avatar2];
    const n = this.state.badges > 3 ? 2 : 1;
    return (
      <div>
        <div className="ListTitle">
          <h1> Your Badges </h1>
        </div>
        <h3>Your points : {this.state.badges}</h3>
        <ul className="DashBoardList">
          {avatars.slice(0, n)}
        </ul>
      </div>
    );
  }
}
