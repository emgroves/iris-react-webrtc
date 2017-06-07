import React, { Component } from 'react'
import '../css/style.css';

class DialPad extends Component {

    render() {
      return (
        <div className="dial-pad">
          <div className="digits-row">
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '1')}}><b>1</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '2')}}><b>2</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '3')}}><b>3</b>
              </button>
          </div>
          <div className="digits-row">
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '4')}}><b>4</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '5')}}><b>5</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '6')}}><b>6</b>
            </button>
          </div>
          <div className="digits-row">
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '7')}}><b>7</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '8')}}><b>8</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '9')}}><b>9</b>
            </button>
          </div>
          <div className="digits-row">
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '*')}}><b>*</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '0')}}><b>0</b>
            </button>
            <button className="btn dig number"
              onClick={() => {this.props.onDialDigit(this.props.number + '#')}}><b>#</b>
            </button>
          </div>
          <div className="digits-row">
            <button className={"btn dig number "+ (this.props.onMute ? 'btn-danger': 'btn-success')} onClick={this.props.onMuteUnmute}>
                <i className={'fa fa-fw fa-microphone ' + (this.props.onMute ? 'fa-microphone-slash': 'fa-microphone')}></i>
            </button>
            <button className={'btn dig number ' + (this.props.onCall ? 'btn-danger': 'btn-success')}
                  onClick={this.props.onDial} disabled={this.props.disabled}>
                <i className={'fa fa-fw fa-phone '+ (this.props.onCall ? 'fa-close': 'fa-phone')}></i>
            </button>
            <button className="btn dig number glyphicon glyphicon-arrow-left btn-danger"
              onClick={this.props.onDeleteDigit}>
            </button>
          </div>
        </div>
        );
    }
}

export default DialPad
