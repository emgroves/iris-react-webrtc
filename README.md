# iris-react-webrtc
This package is designed to simplify use of webrtc-js-sdk in React projects.

## Installation
To install the package use:

```
npm install iris-react-webrtc
```

or it can be included from webpage from following cdn:

```
https://unpkg.com/iris-react-webrtc@0.0.19/dist/iris.react.webrtc.min.js
```

## Components
Package provides following components that can be used to create WebRTC audio/video connections:

* WebRTCBase - this is the main high order component that will call your main component responsible for rendering of the video page.
* LocalVideo - this component renders local video/audio from the caller's computer.
* RemoteVideo - this component renders video/audio coming from remote participants.
* WebRTCConstants - constants to use for registering for the WebRTC library notifications.  See below for the list of the events.

## Initialization
To initialize WebRTC library make the following call:

```javascript

let config = {
  name        : userName,
  routingId   : routingId,
  roomName    : roomName,
  roomId      : roomId,
  domain      : domain,
  hosts       : hosts,
  token       : token,
  resolution  : resolution,
  streamType  : streamType,
  type        : type,
  isPSTN      : isPSTN,
  fromTN      : fromTN,
  toTN        : toTN,
  videoCodec  : videoCodec
}

this.props.initializeWebRTC(config);

```

* userName - any string
* userRoutingId - an uuid generated by your app, can be different one from session to session
* roomId - roomId, use CreateRoomForRoutingIds to get this value.
* domain - this is your application domain name.  This is your application name in lowercase as you defined it in Iris Auth Portal.  You can also get this value programmatically after successful login using Iris Auth JS SDK.  To do it you can call decodeToken(token) function.  For example usage look at the reference app file src/stores/user-store.jsx.
* hosts - urls for event manager and notification manager: { eventManagerUrl: Config.eventManagerUrl, notificationServer: Config.notificationServer }
* token - token received via authentication
* resolution - one of the valid resolutions: 1080, fullhd, 720', hd, 960, 360, 640, vga, 180, 320
* type - This is call type, "video" or "audio" or "pstn"
* streamType - Audio or video local stream to be created. streamType should be either "video" or "audio"
* isPSTN - A boolean value. true if it is a PSTN call.
* fromTN - Telephone number of the caller
* toTN - Telephone number of the callee
* videoCodec - Video codec for the video, default codec is h264

## Usage
Import package into your component with the following statement:

```
import withWebRTC, { LocalVideo, RemoteVideo, WebRTCConstants } from 'iris-react-webrtc';
```

withWebRTC is HOC (Higher Order Component).  Assuming that your component name is chat here is how you would export it to use withWebRTC:

```
class Chat extends React.Component {
  render() {
    return (
      <div>
        {this.props.localVideos.map((connection) => {
          return <LocalVideo key={connection.id} video={connection} />
        })}
        {this.props.remoteVideos.map((connection) => {
          return <RemoteVideo key={connection.id} video={connection} />
        })}
      </div>
    );
  }
}

export default withWebRTC(Chat);
```

The above code also shows how you would display LocalVideo and RemoteVideo as well as install handlers for audio/video mute buttons.  withWebRTC provides functions and properties in this.props of your components.  They are listed in the section below.  localVideos and remoteVideos are lists of the available audio/video streams that can be displayed by the application. Iris React WebRTC library provides LocalVideo and RemoteVideo components to simplify the addition of video/audio as demonstrated in the snippet above.  

To see example of this code look at the file src/components/main.js in reference application.

## Available API Functions
* initializeWebRTC - intialize WebRTC library
* createSession - create iris session
* onAudioMute - call this function to mute audio
* onVideoMute - call this function to mute video
* localVideos - list of local audio/video tracks
* remoteVideos - list of remote audio/video tracks
* sendChatMessage - to send chat messages to participant
* setDisplayName - to set display name
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
* onDominantSpeakerChanged - WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED
* onChatMessage - WEB_RTC_ON_CHAT_MESSAGE_RECEIVED
* onChatAck - WEB_RTC_ON_CHAT_ACK_RECEIVED
* onParticipantVideoMuted - WEB_RTC_ON_PARTICIPANT_VIDEO_MUTED
* onParticipantAudioMuted  - WEB_RTC_ON_PARTICIPANT_AUDIO_MUTED
* onUserProfileChange  - WEB_RTC_ON_USER_PROFILE_CHANGE
