import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Timer from './Timer';
import { Card, CardText } from 'material-ui';
import axios from 'axios';

const prettyMs = require('pretty-ms');
const moment = require('moment');

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      elapsed: 0,
      timing: 0,
      done: false,
    };
    // this.tick = this.tick.bind(this);
  }


  componentDidMount() {
    // this.timer = setInterval(this.tick, 500);
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

      setTimeout(() => {
        if (mocha.suite.suites[0].tests.every(test => test.state === 'passed')) {
          // The timer stops when all test pass
          this.setState({ timing: new Date() - this.state.start, done: true });
          // clearInterval(this.timer);
          document.getElementsByClassName('Confetti')[0].style.display = 'block';
          if (this.props.passed === false) {
            axios.post('/gamewin', { email: this.props.user, gameId: this.props.testId, time: this.state.timing }).then((res) => {
              console.log({ email: this.props.user, gameId: this.props.testId, time: this.state.timing });
              console.log(res);
            });
            this.props.update();
          }
        } else {
          console.log('fail!', 0);
        }
      }, 20);
    } catch (e) {
      eval(`${this.props.test};`);
    }
  }

  // componentWillUnmount() {
  //   // This method is called immediately before the component is removed
  //   // from the page and destroyed. We can clear the interval here:

  //   clearInterval(this.timer);
  // }

  // tick() {
  //   // This function is called every 50 ms. It updates the
  //   // elapsed counter. Calling setState causes the component to be re-rendered
  //   this.setState({ elapsed: new Date() - this.state.start });
  // }

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
  // start: PropTypes.Date.isRequired,
  // compDescState: PropTypes.function.isRequired,
};
