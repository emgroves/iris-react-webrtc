import React, {Component} from 'react'

class RemoteAudio extends Component {

  render(){
    return(
        <div className="remoteAudio">
          <audio id="remoteAudioStream" autoPlay />
        </div>
    )
  }
}

export default RemoteAudio;
