import React, { Component } from 'react';
import axios from 'axios';

const prettyMs = require('pretty-ms');

export default class PersonRankings extends Component {
  constructor() {
    super();
    this.state = {
      GameList: [],
    };
  }
  componentWillMount() {
    axios.get('/findUserByEmail', {
      params: {
        email: window.user,
      },
    }).then(({ data: user }) => {
      console.log(user._id);
      axios.get('/usergames', {
        params: {
          winner: user._id,
        },
      }).then(({ data: games }) => {
        console.log(games);
        games.forEach((game) => {
          axios.get('/competition', {
            params: {
              _id: game.challenge,
            },
          }).then(({ data: gameName }) => {
            console.log(gameName.name, prettyMs(game.time, { verbose: true }));
            this.setState({ GameList: this.state.GameList.concat([[gameName.name, prettyMs(game.time, { verbose: true })]]) });
          });
        });
      });
    });
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
          <h1> General Rankings </h1>
        </div>
        <ul className="DashBoardList">
          {RankingsList}
        </ul>
      </div>
    );
  }
}
