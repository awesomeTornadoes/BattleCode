import React, { Component } from 'react';

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
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor((totalSeconds - hour * 3600) / 60);
    const seconds = Math.floor(totalSeconds - (hour * 3600 + minute * 60));

    return (
      <div id="timer">
        <h2> {pretty} </h2>
        <h2> {hour} : {minute}: {seconds} </h2>
      </div>
    );
  }
}

// function getTimeRemaining(endtime) {
//   var t = Date.parse(endtime) - Date.parse(new Date());
//   var seconds = Math.floor((t / 1000) % 60);
//   var minutes = Math.floor((t / 1000 / 60) % 60);
//   var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
//   var days = Math.floor(t / (1000 * 60 * 60 * 24));
//   return {
//     'total': t,
//     'days': days,
//     'hours': hours,
//     'minutes': minutes,
//     'seconds': seconds
//   };
// }
