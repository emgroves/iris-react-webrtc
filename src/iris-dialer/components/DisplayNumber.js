import React, {Component} from 'react';
import '../css/style.css'

class DisplayNumber extends Component {
  render(){
    return(
      <div className="phoneNumber form-group input-group input-group-md col-md-offset-5 col-xs-4 col-md-2">
        <input type="tel" className="form-control" placeholder="000-000-0000"
            value={this.props.number} onChange={this.props.onNumberChange}/>
      </div>
    );
  }
}

export default DisplayNumber
