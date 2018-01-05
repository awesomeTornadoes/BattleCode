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
        const wins = [];
        const winsObject = res.data.reduce((seed, item) => {
          if (item.challenged !== this.props.user) {
            seed[item.challenged] = seed[item.challenged] ? seed[item.challenged] + 1 : 1;
          } else if (item.challenger !== this.props.user) {
            seed[item.challenger] = seed[item.challenger] ? seed[item.challenger] + 1 : 1;
          }
          return seed;
        }, {});
        for (let user in winsObject) {
          wins.push(user);
          wins.push(winsObject[user]);
        }
        this.setState({ wins });
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
    const userWins = [];
    for (let i = 0; i < this.state.wins.length; i += 2) {
      userWins.push(<li key={this.state.wins[i]} >{this.state.wins[i + 1]} wins against {this.state.wins[i]}</li>);
    }
    return (
      <div className="DashBoardThird">
        <div className="ListTitle">
          <h1> Your Challenges </h1>
        </div>
        <ul className="DashBoardList">
          {RankingsList}
        </ul>
        <h4> Duel wins: </h4>
        <ul className="DashBoardList">
          {userWins[0] ? userWins : 'Looks like you haven\'t won any challenges yet. Challenge someone!'}
        </ul>
        <button onClick={this.sendText}>
          Send Text
        </button>
      </div>
    );
  }
}
