import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';


export default class PersonInfo extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      phone: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    axios.get('/findUserByEmail', {
      params: {
        email: window.user,
      },
    }).then(({ data: user }) => {
      this.setState({ name: user.name, phone: user.phone })
    });
  }


  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit() {
    axios.post('/updateinfo', { email: window.user, name: this.state.name, phone: this.state.phone })
      .then(res => console.log(res));
  }


  render() {
    const style = {
      marginLeft: 20,
    };

    return (
      <div className="DashBoardThird">
        <div className="ListTitle">
          <h1> Your Contact </h1>
        </div>
        <Paper zDepth={2}>
          <label>Email</label>
          <TextField hintText="Email" style={style} disabled underlineShow value={window.user} />
          <Divider />
          <label>Name</label>
          <TextField hintText="Name" style={style} name="name" underlineShow onChange={this.handleChange} value={this.state.name} />
          <Divider />
          <label>Phone</label>
          <TextField hintText="Phone Number" style={style} name="phone" underlineShow onChange={this.handleChange} value={this.state.phone} />
          <Divider />
        </Paper>
        <br />
        <RaisedButton secondary label="UPDATE" style={style} onClick={this.handleSubmit} />
        <br />
      </div>
    );
  }
}
