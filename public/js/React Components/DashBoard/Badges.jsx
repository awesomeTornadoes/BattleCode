import React, { Component } from 'react';
import { blue300, red300, white } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import axios from 'axios';

export default class Badges extends Component {
  constructor() {
    super();
    this.state = {
      badges: '',
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
        });
      });
    });
  }

  render() {
    const avatar1 = (
      <Avatar
        key="J"
        color={white}
        backgroundColor={blue300}
        size={50}
      >
        J
      </Avatar>
    );
    const avatar2 = (
      <Avatar
        key="S"
        color={white}
        backgroundColor={red300}
        size={50}
      >
        S
      </Avatar>
    );
    const avatars = [avatar1, avatar2];
    const n = this.state.badges / 4 > 3 ? 2 : 1;
    const avatarList = avatars.slice(0, n);

    return (
      <div>
        <div className="ListTitle">
          <h1> Your Badges </h1>
        </div>
        <h3>Your points : {this.state.badges}</h3>
        <h5>{avatarList}</h5>
      </div>
    );
  }
}
