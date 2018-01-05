import React from 'react';
import LinearProgress from 'material-ui/LinearProgress';

export default class Difficulty extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      completed: 0,
    };
  }

  componentDidMount() {
    this.setState({ completed: this.props.points * 10 });
  }

  componentWillUpdate() {
    if (this.props.points * 10 !== this.state.completed) {
      this.setState({ completed: this.props.points * 10 });
    }
  }

  render() {
    return (
      <LinearProgress mode="determinate" value={this.state.completed} />
    );
  }
}
