import React, { Component } from 'react';
import { Card, MuiThemeProvider, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import PersonInfo from './PersonInfo';
import Rankings from './Rankings';
import PersonRankings from './PersonRankings';
import Friends from './Friends';
import NavBar from './NavBar';
import CompetitionSelect from '../Competition/CompetitionSelect';

export default class DashBoard extends Component {
  componentWillMount() {
    const pusher = new Pusher('c4b754fe17b65799b281', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe(window.user);

    channel.bind('duel-complete', (data) => {
      alert(data.message);
    });
  }
  render() {
    return (
      <MuiThemeProvider >
        <div className="Dashboard">
          <NavBar user={this.props.user} />
          <Card>
            <div>
              <CompetitionSelect />
              <Link to="CreateCompetition">
                <RaisedButton fullWidth label="Create A Challenge" />
              </Link>
              <div style={{ textAlign: 'center' }}>
                <h1>Welcome {this.props.user.slice(0, this.props.user.indexOf('@'))}!</h1>
              </div>
              <div className="DashBoardFlex">
                <PersonInfo />
                <Rankings />
                <PersonRankings user={this.props.user} />
                <Friends user={this.props.user} />
              </div>
            </div>
          </Card>
        </div>
      </MuiThemeProvider >
    );
  }
}
