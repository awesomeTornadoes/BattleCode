import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, CardText, MuiThemeProvider } from 'material-ui';
import Script from 'react-load-script';
import { GoogleLogin } from 'react-google-login-component';
import boat from '../../../../images/SSBattleCode.png';

export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoginLoaded: false,
      user: null,
    };
    this.responseGoogle = this.responseGoogle.bind(this);
  }

  responseGoogle(googleUser) {
    const idToken = googleUser.getAuthResponse().id_token;
    const profile = googleUser.getBasicProfile();
    const userEmail = profile.getEmail();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/signin', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
      window.isLoggedIn = true;
      window.user = userEmail;
      this.setState({
        userLoginLoaded: true,
        user: userEmail,
      });
      setTimeout(() => { window.location.hash = '/dash'; }, 0);
    };
    xhr.send(`idtoken=${idToken}`);
  }
  render() {
    return (
      <MuiThemeProvider >
        <Card>
          <div className="col-md-12 Signin">
            <Script url="https://apis.google.com/js/platform.js" />
            {this.state.userLoginLoaded ? <Redirect to="/dash" /> : <div />}
            <div id="boat">
              <h1 className="headers" style={{ 'font-family': 'Monoton, cursive', fontSize: '60pt' }}>BATTLE CODE</h1>
              <img className="animated" src={boat} alt="battle boat" />
            </div>
            <h3 className="headers" style={{ 'font-family': 'Roboto, sans-serif', fontSize: '20pt' }}>Compete against others to prove your coding skills</h3>
            <CardText className="signin-buttons">
              <GoogleLogin
                socialId="414320534713-9r05dhe2spf3fid09lk1vfhdhegth1da.apps.googleusercontent.com"
                className="login-btn"
                style={{ 'border-radius': '10px' }}
                scope="https://www.googleapis.com/auth/userinfo.email"
                responseHandler={this.responseGoogle}
                buttonText="Login With Google"
              />
            </CardText>
          </div>
        </Card>
      </MuiThemeProvider>
    );
  }
}
