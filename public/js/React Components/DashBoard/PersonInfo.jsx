import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


export default class Badges extends Component {
  constructor() {
    super();
    this.state = { name: '', phone: '', email: '', hint: '' };
  }
  handleChange(name, value) {
    this.setState();
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
          <TextField hintText="Phone Number" style={style} underlineShow value={window.user}/>
          <Divider />
          <label>Phone</label>
          <TextField hintText="Phone Number" style={style} underlineShow value={window.user}/>
          <Divider />
        </Paper>
        <br />
        <RaisedButton label="UPDATE" style={style} />
        <br />
      </div>
    );
  }
}
