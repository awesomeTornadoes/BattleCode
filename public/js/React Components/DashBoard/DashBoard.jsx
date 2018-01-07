import React, { Component } from 'react';
import { Card, MuiThemeProvider, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import PersonInfo from './PersonInfo';
import Rankings from './Rankings';
import PersonRankings from './PersonRankings';
import Friends from './Friends';
import NavBar from './NavBar';
import CompetitionSelect from '../Competition/CompetitionSelect';

export default class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }
  componentWillMount() {
    const pusher = new Pusher('c4b754fe17b65799b281', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe(window.user);

    channel.bind('duel-complete', (data) => {
      alert(data.message);
    });
    axios.get('/findUserByEmail', {
      params: {
        email: this.props.user,
      },
    }).then(({ data }) => {
      this.setState({ userName: data.name });
    });
  }
  render() {
    return (
      <MuiThemeProvider >
        <div className="Dashboard">
          <NavBar user={this.props.user} userName={this.state.userName} />
          <Card>
            <div>
              <CompetitionSelect />
              <Link to="CreateCompetition">
                <RaisedButton fullWidth label="Create A Challenge" />
              </Link>
              <div style={{ textAlign: 'center' }}>
                <h1>Welcome {this.state.userName ? this.state.userName : this.props.user}!</h1>
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

DashBoard.propTypes = {
  user: PropTypes.string.isRequired,
};
