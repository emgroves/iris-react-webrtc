import React, {Component} from 'react';
import './style.css';

import DialPad from '../DialPad';

class DialerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: '',
    }
  }

  updatePhoneNumber(number) {
    this.setState({phoneNumber: number});
  }

  phoneNumberChanged(event) {
    this.updatePhoneNumber(event.target.value);
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}} className="dialer">
          <input 
            type="text"
            value={this.state.phoneNumber} 
            onChange={this.phoneNumberChanged.bind(this)} 
            className="dialerInput"
          />
          <DialPad 
            phoneNumber={this.state.phoneNumber}
            onDial={this.updatePhoneNumber.bind(this)}
            style={{display: 'flex'}}
          />
      </div>
    );
  }
}

export default DialerContainer;