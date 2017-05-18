import React, {PropTypes} from 'react';
import './style.css';

import DialPadKey from '../DialPadKey';

const DialPad = (props) => {
  return (
    <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
        <div style={{display: 'flex'}}>
          <DialPadKey symbol="1" onClick={() => props.onDial(props.phoneNumber + '1')} />
          <DialPadKey symbol="2" onClick={() => props.onDial(props.phoneNumber + '2')} />
          <DialPadKey symbol="3" onClick={() => props.onDial(props.phoneNumber + '3')} />
        </div>
        <div style={{display: 'flex'}}>
          <DialPadKey symbol="4" onClick={() => props.onDial(props.phoneNumber + '4')} />
          <DialPadKey symbol="5" onClick={() => props.onDial(props.phoneNumber + '5')} />
          <DialPadKey symbol="6" onClick={() => props.onDial(props.phoneNumber + '6')} />
        </div>
        <div style={{display: 'flex'}}>
          <DialPadKey symbol="7" onClick={() => props.onDial(props.phoneNumber + '7')} />
          <DialPadKey symbol="8" onClick={() => props.onDial(props.phoneNumber + '8')} />
          <DialPadKey symbol="9" onClick={() => props.onDial(props.phoneNumber + '9')} />
        </div>
        <div style={{display: 'flex'}}>
          <DialPadKey symbol="*"/>
          <DialPadKey symbol="0" onClick={() => props.onDial(props.phoneNumber + '0')} />
          <DialPadKey symbol="#"/>
        </div>
    </div>
  );
};

DialPad.propTypes = {
  onDial: PropTypes.func,
  phoneNumber: PropTypes.string,
}

DialPad.defaultProps = {
  onDial: () => {},
  phoneNumber: '',
}

export default DialPad;