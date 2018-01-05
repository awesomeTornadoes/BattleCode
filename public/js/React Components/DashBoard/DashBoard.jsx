import React from 'react';
import { AppBar, Card, MuiThemeProvider, RaisedButton } from 'material-ui';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import PropTypes from 'prop-types';
import {
  purple500,
  white,
} from 'material-ui/styles/colors';
import PersonInfo from './PersonInfo';
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
          <div style={{ textAlign: 'center' }}>
            <h1>Welcome {props.user.slice(0, props.user.indexOf('@'))}!</h1>
            <Avatar
              color={white}
              backgroundColor={purple500}
              size={30}
            >
              {window.user.slice(0, 1).toUpperCase()}
            </Avatar>
          </div>
          <div className="DashBoardFlex">
            <PersonInfo />
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
