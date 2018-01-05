import React, { Component } from 'react';

const moment = require('moment');
const prettyMs = require('pretty-ms');

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      elapsed: 0,
      timing: 0,
    };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    // this.setState({ start: this.props.start });
    this.timer = setInterval(this.tick, 500);
  }

  componentWillUpdate() {
    if (this.props.done === true) {
      clearInterval(this.timer);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({ elapsed: new Date() - this.props.start });
  }

  render() {
    const pretty = prettyMs(this.state.elapsed, { verbose: true });
    const totalSeconds = this.state.elapsed / 1000;
    const hour = (`0${Math.floor(totalSeconds / 3600)}`.slice(-2));
    const minute = (`0${  Math.floor((totalSeconds - hour * 3600) / 60)}`.slice(-2));
    const seconds = (`0${  Math.floor(totalSeconds - (hour * 3600 + minute * 60))}`.slice(-2));

    return (
      <div id="timer">
        <h2> {hour} : {minute}: {seconds} </h2>
      </div>
    );
  }
}
