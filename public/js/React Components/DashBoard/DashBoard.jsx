import React, { Component } from 'react';
import { AppBar, Card, MuiThemeProvider, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Badges from './Badges';
import Rankings from './Rankings';
import PersonRankings from './PersonRankings';
import Friends from './Friends';
import NavBar from './NavBar';
import CompetitionSelect from '../Competition/CompetitionSelect';

export default class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    // axios.get('/duels', { headers: { user: this.props.user } })
    //   .then((response) => {
    //     this.setState({ duels: response.data });
    //   })
    //   .catch(err => console.error(err));

    const pusher = new Pusher('c4b754fe17b65799b281', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe(window.user);

    // channel.bind('duel-event', (data) => {
    //   // alert(data.message);
    //   axios.get('/duels', { headers: { user: this.props.user } })
    //     .then((response) => {
    //       this.setState({ duels: response.data });
    //     })
    //     .catch(err => console.error(err));
    // });
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
              <div style={{ textAlign: 'center' }}>Welcome {this.props.user.slice(0, this.props.user.indexOf('@'))}!</div>
              <div className="DashBoardFlex">
                <Badges />
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


// DashBoard.propTypes = {
//   user: PropTypes.string.isRequired,
// };
// export default DashBoard;
