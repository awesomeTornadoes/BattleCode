import React, { Component } from 'react';
import axios from 'axios';

const prettyMs = require('pretty-ms');

export default class PersonRankings extends Component {
  constructor() {
    super();
    this.state = {
      GameList: [],
      wins: [],
    };
    this.sendText = this.sendText.bind(this);
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
        games.forEach((game) => {
          axios.get('/competition', {
            params: {
              _id: game.challenge,
            },
          }).then(({ data: gameName }) => {
            this.setState({ GameList: this.state.GameList.concat([[gameName.name, prettyMs(game.time, { verbose: true })]]) });
          });
        });
      });
    });
    axios.get('/userwins', { headers: { user: this.props.user } })
      .then((res) => {
        console.log(res);
        this.setState({ wins: res.data });
      });
  }

  sendText() {
    axios.post('/text', { user: window.user.slice(0, window.user.indexOf('@')) })
      .then(ans => { /*console.log(ans)*/ });
  }

  render() {
    const RankingsList = this.state.GameList.map((e, i) => (
      <li key={e[0]} className="RankList">
        <p>
          <b> {i + 1}. </b>
          <span> {e[0]} : {e[1]}</span>
        </p>
      </li>
    ));
    return (
      <div className="DashBoardThird">
        <div className="ListTitle">
          <h1> Personal Challenges timing </h1>
        </div>
        <ul className="DashBoardList">
          {RankingsList}
        </ul>
        <button onClick={this.sendText}>
          Send Text
        </button>
      </div>
    );
  }
}
