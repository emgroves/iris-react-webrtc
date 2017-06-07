import React, { Component } from 'react';
import DialPad from './DialPad';
import DisplayNumber from './DisplayNumber';
import StatusText from './StatusText';
import RemoteAudio from './RemoteAudio'
import '../css/style.css';

class IrisDialer extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="iris-dialer-app">
        <div className="container">
          <DisplayNumber number={this.props.number}
            onNumberChange={this.props.onNumberChange}/>
          <DialPad number={this.props.number}
            onDialDigit={this.props.onDialDigit}
            onDeleteDigit={this.props.onDeleteDigit}
            onMuteUnmute={this.props.onMuteUnmute}
            onDial={this.props.onDial}
            onTextChange={this.props.onTextChange}
            onCall={this.state.props.onCall}
            onMute={this.state.props.onMute}/>
          <StatusText number={this.props.number} statusText={this.props.statusText}/>
          <RemoteAudio />
        </div>
      </div>
    );
  }
}

export default IrisDialer;
