import React, { Component } from 'react';
import DialPad from './DialPad';
import DisplayNumber from './DisplayNumber';
import StatusText from './StatusText';
import RemoteAudio from './RemoteAudio'
import '../css/style.css';

export default class IrisDialer extends Component {

  constructor(props){
    super(props);
    this.state = {
      number: "",
      onMute: false,
      onHold: false,
      statusText: "Dial a number",
      localStream: null,
      remoteStream: null,
    }
    this.onDialDigit = this.onDialDigit.bind(this);
    this.onDeleteDigit = this.onDeleteDigit.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
  }

  onDialDigit(number) {
    console.log("Number : " + number);
    const numLength = number.length;
    const text = numLength > 0 ? "Dialing" : "Dial a number";
    numLength <= this.props.maxNumberLength ?
      this.setState({number: number, statusText: text}, () => this.props.updateToTN(this.state.number))
      :
      console.log("Number exceeds maximum length. No update")
  }

  onDeleteDigit() {
    let number = this.state.number.slice(0, -1);
    console.log("Number : " + number);
    const text = number.length > 0 ? "Dialing" : "Dial a number";
    this.setState({number : number, statusText: text}, () => this.props.updateToTN(this.state.number));
  }

  onNumberChange(event) {
    console.log("Number: ", event.target.value)
    const numLength = event.target.value.length;
    const text = numLength > 0 ? "Dialing" : "Dial a number";
    numLength <= this.props.maxNumberLength ?
      this.setState({number: event.target.value, statusText: text}, () => this.props.updateToTN(this.state.number))
      :
      console.log("Number exceeds maximum length. No update")
  }

  render() {
    return (
      <div className="iris-dialer-app">
        <div className="iris-dialer-container">
          <DisplayNumber number={this.state.number}
            onNumberChange={this.onNumberChange}/>
          <DialPad number={this.state.number}
            onDialDigit={this.props.onDialDigit ? this.props.onDialDigit : this.onDialDigit}
            onDeleteDigit={this.props.onDeleteDigit ? this.props.onDeleteDigit : this.onDeleteDigit}
            onMuteUnmute={this.props.onMuteUnmute}
            onDial={this.props.onDial}
            callInProgress={this.props.callInProgress}
            onMute={this.state.onMute}/>
          {this.props.displayStatusBox ?
            <StatusText number={this.state.number} statusText={this.state.statusText}/>
            : null}
          <RemoteAudio />
        </div>
      </div>
    );
  }

}
