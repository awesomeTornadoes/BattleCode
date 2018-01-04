import React, { Component } from 'react';
import {
  AppBar,
  MenuItem,
  IconMenu,
  IconButton,
  MoreVertIcon,
  FlatButton,
  Toggle,
  NavigationClose,
  Drawer,
} from 'material-ui';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duels: [],
      open: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentWillMount() {
    axios.get('/duels', { headers: { user: this.props.user } })
      .then((response) => {
        console.log(response);
        this.setState({ duels: response.data });
      })
      .catch(err => console.error(err));
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }
  toggleDrawer() {
    this.setState({ open: !this.state.open })
  }
  render() {
    // const menuItems = this.state.duels.map((duel) => {
    //   return { text: duel.challenger };
    // });
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={() => this.toggleDrawer()}
          title="Battle Code"
          style={{ backgroundColor: '#4FB5DB' }}
        />
        <Drawer
          docked={false}
          onRequestChange={(open) => this.setState({ open })}
          open={this.state.open}
        >
          <MenuItem
            containerElement={<Link to="/login" />}
            onTouchTap={() => { this.toggleDrawer(); }}
            primaryText="Home"
          />
          <MenuItem
            containerElement={<Link to="/login" />}
            onTouchTap={() => { this.toggleDrawer(); }}
            primaryText="Some Component"
          />
        </Drawer>
      </div>
    );
  }
}

// const Competitions = this.state.Competitions.map(comp => (
//   <Link
//     to={`/competition?id=${comp._id}`}
//     key={comp._id}
//     className="CompetitionItem"
//   >
//     <MenuItem primaryText={comp.name} />
//   </Link>
// ));
