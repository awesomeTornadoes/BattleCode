import React from 'react';
import { AppBar, Card, MuiThemeProvider, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Badges from './Badges';
import Rankings from './Rankings';
import PersonRankings from './PersonRankings';
import Friends from './Friends';
import NavBar from './NavBar';
import CompetitionSelect from '../Competition/CompetitionSelect';

const DashBoard = props => (
  <MuiThemeProvider >
    <div className="Dashboard">
      <NavBar user={props.user} />
      <Card>
        <div>
          <CompetitionSelect />
          <Link to="CreateCompetition">
            <RaisedButton fullWidth label="Create A Challenge" />
          </Link>
          <div style={{ textAlign: 'center' }}>Welcome {props.user.slice(0, props.user.indexOf('@'))}!</div>
          <div className="DashBoardFlex">
            <Badges />
            <Rankings />
            <PersonRankings user={props.user} />
            <Friends user={props.user} />
          </div>
        </div>
      </Card>
    </div>
  </MuiThemeProvider >
);


DashBoard.propTypes = {
  user: PropTypes.string.isRequired,
};
export default DashBoard;
