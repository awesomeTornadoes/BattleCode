import React, { Component } from 'react';
import {
  AppBar,
  MenuItem,
  Drawer,
  Badge,
} from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      // alert(data.message);
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
    const menuItems = this.state.duels.filter(duel => !duel.complete).map((duel, i) => (
      <MenuItem
        key={duel._id}
        containerElement={<Link to={`/competition/?id=${duel.challenge}&duel=${duel._id}`} />}
        primaryText={duel.challenger}
      />
    ));
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={() => this.toggleDrawer()}
          title="Battle Code"
          style={{ backgroundColor: '#4FB5DB' }}
          iconElementLeft={
            this.state.duels.length ?
              <Badge badgeContent={this.state.duels.length}><MenuIcon style={{ color: 'white', cursor: 'pointer' }} /></Badge> :
              <MenuIcon style={{ color: 'white', cursor: 'pointer' }} />
          }
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
