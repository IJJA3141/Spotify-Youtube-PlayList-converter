import React from 'react'
import ReactDOM from 'react-dom'

interface LoggingProps {
  message:string
}

interface LoggingState {
  count: number
}

class Logging extends React.Component<LoggingProps, LoggingState> {
  state = { count: 0 };
  render() {
    return (
      <div onClick={() => this.increment(1)}>
        {this.props.message} {this.state.count}
      </div>
    );
  }
  increment = (amt: number) => {
    // like this
    this.setState((state) => ({
      count: state.count + amt,
    }));
  };
}

export default Logging
