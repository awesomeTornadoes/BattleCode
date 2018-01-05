import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Timer from './Timer';
import { Card, CardText } from 'material-ui';
import axios from 'axios';

const prettyMs = require('pretty-ms');

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      elapsed: 0,
      timing: 0,
      done: false,
    };
  }


  componentDidMount() {
    this.setState({ start: Date.now() });

    try {
      mocha.suite.suites.splice(0, 1);
      eval(`${this.props.userInput}; ${this.props.test};`);
    } catch (e) {
      eval(`${this.props.test};`);
    }
  }

  componentDidUpdate() {
    this.mocha.innerHTML = '';
    try {
      mocha.suite.suites.splice(0, 1);
      eval(`${this.props.userInput}; ${this.props.test};`);
      this.timerId = setTimeout(() => {
        if (mocha.suite.suites[0].tests.every(test => test.state === 'passed')) {
          this.setState({ timing: new Date() - this.state.start, done: true });
          document.getElementsByClassName('Confetti')[0].style.display = 'block';
          const duelId = window.location.hash.split('&duel=')[1];
          if (duelId) {
            axios.post('/duelUpdate', { email: this.props.user, gameId: this.props.testId, time: this.state.timing, duelId })
              .then(res => console.log(res));
          }
          if (this.props.passed === false) {
            axios.post('/gamewin', { email: this.props.user, gameId: this.props.testId, time: this.state.timing }).then((res) => {
            });
            this.props.update();
          }
        }
      }, 20);
    } catch (e) {
      eval(`${this.props.test};`);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  render() {
    const pretty = prettyMs(this.state.elapsed, { verbose: true });

    return (
      <div>
        <div>
          <Timer start={this.state.start} elapsed={this.state.elasped} done={this.state.done} />
        </div>
        <Card>
          <CardText >
            <div id="mocha" ref={(mocha) => { this.mocha = mocha; }} style={{ margin: 0 }} />
          </CardText>
        </Card>
      </div>
    );
  }
}

Test.propTypes = {
  test: PropTypes.string.isRequired,
  userInput: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
