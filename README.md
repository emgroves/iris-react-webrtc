# iris-react-webrtc
This package is designed to simplify use of webrtc-js-sdk in React projects.

## Installation
To install the package use:

```
npm install iris-react-webrtc
```

or it can be included from webpage from following cdn:

```
https://npmcdn.com/iris-react-webrtc@0.0.6/dist/iris.react.webrtc.min.js
```

## Components
Package provides following components that can be used to create WebRTC audio/video connections:

* WebRTCBase - this is the main high order component that will call your main component responsible for rendering of the video page.
* LocalVideo - this component renders local video/audio from the caller's computer.
* RemoteVideo - this component renders video/audio coming from remote participants.
* WebRTCConstants - constants to use for registering for the WebRTC library notifications.  See below for the list of the events.

## Usage
Import package into your component with the following statement:

```
import withWebRTC, { LocalVideo, RemoteVideo, WebRTCConstants } from 'iris-react-webrtc';
```

Assuming that your component name is chat here is how you would export it to use withWebRTC:

```
class Chat extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.onAudioMute.bind(this)}>{this.state.isAudioMuted ? <i className="fa fa-microphone-slash fa-2x" aria-hidden="true"></i> : <i className="fa fa-microphone fa-2x" aria-hidden="true"></i>}</button>
        <button onClick={this.props.onVideoMute.bind(this)}>{this.state.isVideoMuted ? <i className="fa fa-eye-slash fa-2x" aria-hidden="true"></i> : <i className="fa fa-video-camera fa-2x" aria-hidden="true"></i>}</button>
      </div>
      <div>
        {this.props.localVideos.map((connection) => {
          return <LocalVideo key={connection.video.index} video={connection.video} audio={connection.audio} />
        })}
        {this.props.remoteVideos.map((connection) => {
          return <RemoteVideo key={connection.video.index} video={connection.video} audio={connection.audio} />
        })}
      </div>
    );
  }
}

export default withWebRTC(Chat);
```

The above code also shows how you would display LocalVideo and RemoteVideo as well as install handlers for audio/video mute buttons.

## Available API Functions
* initializeWebRTC - intialize WebRTC library
* onAudioMute - call this function to mute audio
* onVideoMute - call this function to mute video
* localVideos - list of local audio/video tracks
* remoteVideos - list of remote audio/video tracks
* endSession - call to end WebRTC session
* addWebRTCListener - add listener for the given event type (see section below for list of available events)
* removeWebRTCListener - remove event listener that was previously installed with the above call

## Notifications
This is the list of available events and their constants that can be passed to addWebRTCListener to start listening for them.

* onLocalAudio - WEB_RTC_ON_LOCAL_AUDIO
* onLocalVideo - WEB_RTC_ON_LOCAL_VIDEO
* onSessionCreated - WEB_RTC_ON_SESSION_CREATED
* onRemoteParticipantJoined - WEB_RTC_ON_REMOTE_PARTICIPANT_JOINED
* onSessionConnected - WEB_RTC_ON_SESSION_CONNECTED
* onRemoteVideo - WEB_RTC_ON_REMOTE_VIDEO
* onRemoteParticipantLeft - WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT
* onSessionEnded - WEB_RTC_ON_SESSION_ENDED
* onConnectionError - WEB_RTC_ON_CONNECTION_ERROR
* onNotificationReceived - WEB_RTC_ON_NOTIFICATION_RECEIVED
