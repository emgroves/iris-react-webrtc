import React, {Component} from 'react';
import './css/style.css'

//old input
// <input type="tel" className="form-control" placeholder="215-286-2328"
//     value={this.props.number} onChange={this.props.onNumberChange}/>
const textFieldStyle = {
    "textAlign" : "center",
}


class DisplayNumber extends Component {
  render(){
    return(
    <div className="phone-number-inputfield">
      <input type="tel" className="phone-number-text" placeholder="123-456-7890"
    value={this.props.number} onChange={this.props.onNumberChange}/>
    </div>
    );
  }
}

export default DisplayNumber
