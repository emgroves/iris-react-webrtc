import React, {Component} from 'react'

class StatusText extends Component {
  render(){
    return(
      <div className="">
        {this.props.statusText} {this.props.number}
      </div>
    );
  }
}

export default StatusText
