import React, {PropTypes} from 'react';

const DialPadKey = (props) => {
  return (
    <div style={{display: 'flex', flex: 1}} className="text-center dialpadKey" onClick={props.onClick}>
      {props.symbol}
    </div>
  );
};

DialPadKey.propTypes = {
  symbol: PropTypes.string.isRequired,
}

export default DialPadKey;