import React, { Component } from 'react';
import {
  AppBar,
  MenuItem,
  Drawer,
  Badge,
} from 'material-ui';
import PropTypes from 'prop-types';
import MenuIcon from 'material-ui-icons/Menu';
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
      open: false,
      duels: [],
    };
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentWillMount() {
    axios.get('/duels', { headers: { user: this.props.user } })
      .then((response) => {
        this.setState({ duels: response.data });
      })
      .catch(err => console.error(err));
    const pusher = new Pusher('c4b754fe17b65799b281', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe(window.user);

    channel.bind('duel-event', (data) => {
      alert(data.message);
      axios.get('/duels', { headers: { user: this.props.user } })
        .then((response) => {
          this.setState({ duels: response.data });
        })
        .catch(err => console.error(err));
    });
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
        key={duel._id}
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
        {this.props.userName ? this.props.userName.slice(0, 1).toUpperCase() : this.props.user.slice(0, 1).toUpperCase()}
      </Avatar>
    );
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={() => this.toggleDrawer()}
          title="Battle Code"
          style={{ backgroundColor: '#4FB5DB' }}
          iconElementLeft={
            menuItems.length ?
              <Badge secondary badgeContent={menuItems.length}>
                <MenuIcon style={{ color: 'white', cursor: 'pointer' }} />
              </Badge>
              :
              <MenuIcon style={{ color: 'white', cursor: 'pointer' }} />
          }
          iconElementRight={avatar}
        />
        <Drawer
          docked={false}
          onRequestChange={open => this.setState({ open })}
          open={this.state.open}
        >
          <p style={{ marginTop: '10px', marginLeft: '10px' }}>Your open challenges:</p>
          {menuItems}
        </Drawer>
      </div>
    );
  }
}

NavBar.propTypes = {
  user: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};
