import React, { Component } from 'react'
import './css/style.css';

class DialPad extends Component {
    constructor(props) {
        super(props);
        this.state = {
          // number:""
        }
    }

    render() {
      return (
        <div className="dial-pad">
          <div className="digits-row">
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '1')}}><div className="dialer-digit">1</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '2')}}><div className="dialer-digit">2</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '3')}}><div className="dialer-digit">3</div>
            </button>
          </div>
          <div className="digits-row">
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '4')}}><div className="dialer-digit">4</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '5')}}><div className="dialer-digit">5</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '6')}}><div className="dialer-digit">6</div>
            </button>
          </div>
          <div className="digits-row">
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '7')}}><div className="dialer-digit">7</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '8')}}><div className="dialer-digit">8</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '9')}}><div className="dialer-digit">9</div>
            </button>
          </div>
          <div className="digits-row">
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '*')}}><div className="dialer-digit">*</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '0')}}><div className="dialer-digit">0</div>
            </button>
            <button className="dialer-button"
              onClick={() => {this.props.onDialDigit(this.props.number + '#')}}><div className="dialer-digit">#</div>
            </button>
          </div>
          <div className="digits-row">
            <button onClick={this.props.onMuteUnmute} className="dialer-button">
              <div className="dialer-digit"><i className={'fa fa-fw fa-microphone ' + (this.props.onMute ? 'fa-microphone-slash': 'fa-microphone')}></i></div>
            </button>
            <button onClick={this.props.onDial} disabled={this.props.disabled} className="dialer-button">
                <div className="dialer-digit"><i className={'fa fa-fw fa-phone '+ (this.props.onCall ? 'fa-close': 'fa-phone')} ></i></div>
            </button>
            <button onClick={this.props.onDeleteDigit} className="dialer-button">
              <div className="dialer-digit"><i className={'fa fa-times-rectangle-o'}></i></div>
            </button>
          </div>
        </div>
        );
    }
}

export default DialPad
