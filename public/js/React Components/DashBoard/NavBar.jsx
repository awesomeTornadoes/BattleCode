import React, { Component } from 'react';
import {
  AppBar,
  MenuItem,
  Drawer,
  Badge,
  FlatButton,
} from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';
import { notification } from 'material-ui/svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import {
  purple500,
  white,
} from 'material-ui/styles/colors';

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
        this.setState({ duels: response.data });
      })
      .catch(err => console.error(err));
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }
  toggleDrawer() {
    axios.get('/duels', { headers: { user: this.props.user } })
      .then((response) => {
        this.setState({ duels: response.data });
      })
      .catch(err => console.error(err));
    this.setState({ open: !this.state.open });
  }
  render() {
    const menuItems = this.state.duels.filter(duel => !duel.complete).map(duel => (
      <MenuItem
        key={duel}
        containerElement={<Link to={`/competition/?id=${duel.challenge}&duel=${duel._id}`} />}
        primaryText={duel.challenger}
      />
    ));
    const avatar = (
      <Avatar
        color={white}
        backgroundColor={purple500}
        size={50}
      >
        {window.user.slice(0, 1).toUpperCase()}
      </Avatar>
    );
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={() => this.toggleDrawer()}
          title="Battle Code"
          style={{ backgroundColor: '#4FB5DB' }}
          iconElementLeft={<Badge badgeContent={menuItems.length}><MenuIcon style={{ color: 'white', cursor: 'pointer' }} /></Badge>}
          iconElementRight={avatar}
        />
        <Drawer
          docked={false}
          onRequestChange={open => this.setState({ open })}
          open={this.state.open}
        >
          Your open challenges:
          {menuItems}
        </Drawer>
      </div>
    );
  }
}
