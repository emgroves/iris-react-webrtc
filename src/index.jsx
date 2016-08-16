import React from 'react';
import _ from 'underscore';
import KeyMirror from 'keymirror'
import { EventEmitter } from 'events';

export const WebRTCConstants = KeyMirror({
  WEB_RTC_ON_LOCAL_AUDIO: null,
  WEB_RTC_ON_LOCAL_VIDEO: null,
  WEB_RTC_ON_SESSION_CREATED: null,
  WEB_RTC_ON_REMOTE_PARTICIPANT_JOINED: null,
  WEB_RTC_ON_SESSION_CONNECTED: null,
  WEB_RTC_ON_REMOTE_VIDEO: null,
  WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT: null,
  WEB_RTC_ON_SESSION_ENDED: null,
  WEB_RTC_ON_CONNECTION_ERROR: null,
  WEB_RTC_ON_NOTIFICATION_RECEIVED: null,
  WEB_RTC_ON_AUDIO_MUTE: null,
  WEB_RTC_ON_VIDEO_MUTE: null,
  WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED: null,
});

export let WebRTCEvents = class WebRTCEvents extends EventEmitter {
  constructor(props) {
    super(props);
  }

  emitWebRTCEvent(eventType, event) {
    this.emit(eventType, event);
  }

  addWebRTCListener(eventType, callback) {
    this.on(eventType, callback);
  }

  removeWebRTCListener(eventType, callback) {
    this.removeListener(eventType, callback);
  }
}

export let LocalVideo = class LocalVideo extends React.Component {
  constructor(props) {
    super(props);
    console.log('in constructor of localVideo');
    console.log(this.props);
  }

  componentDidMount() {
    this.props.video.track.attach($(this.refs.localVideo)[0]);
    this.props.audio.track.attach($(this.refs.localAudio)[0]);
  }

  componentWillUnmount() {
    this.props.video.track.detach($(this.refs.localVideo)[0]);
    this.props.audio.track.detach($(this.refs.localAudio)[0]);
  }

  render() {
    return <div>
      {this.props.video ? <video ref='localVideo' autoPlay='1' id={'localVideo' + this.props.video.index} src={this.props.video.src} /> : null}
      {this.props.audio ? <audio ref='localAudio' autoPlay='1' muted='true' id={'localAudio' + this.props.audio.index} src={this.props.audio.src} /> : null}
    </div>
  }
}

export let RemoteVideo = class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      {this.props.video ? <video autoPlay="1" id={this.props.video.index} src={this.props.video.src} /> : null}
      {this.props.audio ? <audio autoPlay="1" id={this.props.audio.index} src={this.props.audio.src} /> : null}
    </div>
  }
}

export default (ComposedComponent) => {
  return class WebRTCBase extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        xrtcSDK: null,
        userConfig: null,
        isAudioMuted: false,
        isVideoMuted: false,
        localConnectionList: [],
        remoteConnectionList: [],
      }

      this.localTracks = [];
      this.remoteTracks = [];
      this.eventEmitter = new WebRTCEvents();
    }

    _initializeWebRTC(userName, routingId, roomName, domain, eventManagerUrl, token, resolution = 'hd') {
      console.log('initializeWebRTC -> userName ' + userName);
      console.log('initializeWebRTC -> routingId ' + routingId);
      console.log('initializeWebRTC -> roomName ' + roomName);
      console.log('initializeWebRTC -> domain ' + domain);
      console.log('initializeWebRTC -> resolution ' + resolution);

      const traceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
      let userConfig = {
        jid: userName,
        password: '',
        roomName: roomName,
        domain: domain,
        token: token,
        routingId: routingId,
        traceId: traceId,
        useEventManager: true,
        callType: "videocall",
        loginType: "connect",
        resolution: resolution,
        eventManager: eventManagerUrl
      }
      let serverConfig = userConfig;
      console.log("init SDK");
      console.log(userConfig);
      let xrtcSDK = new window.xrtcSDK(serverConfig);
      this.setState({
        xrtcSDK: xrtcSDK,
        userConfig: userConfig,
      });

      console.log(userConfig);

      xrtcSDK.createReceiver(userConfig.jid);
      xrtcSDK.createSession([], userConfig, this._onWebRTCConnect);

      if (xrtcSDK != null) {
        xrtcSDK.onLocalAudio = this._onLocalAudio.bind(this);
        xrtcSDK.onLocalVideo = this._onLocalVideo.bind(this);
        xrtcSDK.onSessionCreated = this._onSessionCreated.bind(this);
        xrtcSDK.onRemoteParticipantJoined = this._onRemoteParticipantJoined.bind(this);
        xrtcSDK.onSessionConnected = this._onSessionConnected.bind(this);
        xrtcSDK.onRemoteVideo = this._onRemoteVideo.bind(this);
        xrtcSDK.onRemoteParticipantLeft = this._onRemoteParticipantLeft.bind(this);
        xrtcSDK.onSessionEnded = this._onSessionEnded.bind(this);
        xrtcSDK.onConnectionError = this._onConnectionError.bind(this);
        xrtcSDK.onNotificationReceived = this._onNotificationReceived.bind(this);
        xrtcSDK.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);
      }
    }

    _onDominantSpeakerChanged(dominantSpeakerEndpoint) {
      console.log('onDominantSpeakerChanged' + dominantSpeakerEndpoint);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, dominantSpeakerEndpoint);
    }

    _sessionEnd() {
      if (this.state.xrtcSDK) {
        this.state.xrtcSDK.endSession();
      }
    }

    _onWebRTCConnect(response) {
      console.log('createSession callback');
      console.log(response);
    }

    _onLocalAudio() {
      console.log('onLocalAudio');
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_LOCAL_AUDIO);
    }

    _onLocalVideo(sessionId, tracks) {
      console.log('onLocalVideo');
      console.log(sessionId);
      console.log(tracks);

      this.localTracks = tracks;
      let localConnectionList = this.state.localConnectionList;
      let audioConnection = null;
      let videoConnection = null;

      for (let i = 0; i < this.localTracks.length; i++) {
        if (this.localTracks[i].getType() == "video") {
            //this.localTracks[i].attach("");
            videoConnection = {
              index: i,
              src: this.localTracks[i].stream.jitsiObjectURL,
              track: this.localTracks[i],
            }
        } else {
            //this.localTracks[i].attach("");
            audioConnection = {
              index: i,
              src: this.localTracks[i].stream.jitsiObjectURL,
              track: this.localTracks[i],
            }
        }
        //this.state.xrtcSDK.addTrack(this.localTracks[i]);
      }
      localConnectionList.push({
        video: videoConnection,
        audio: audioConnection,
      });
      this.setState({
        localConnectionList: localConnectionList,
      }, () => {
        this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO, {
          sessionId,
          tracks,
        });
      });
    }

    _onSessionCreated(sessionId, roomName) {
      console.log('onSessionCreated - session created with ' + sessionId + ' and user joined in ' + roomName);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_SESSION_CREATED, {
        sessionId,
        roomName,
      });
    }

    _onRemoteParticipantJoined() {
      console.log('onRemoteParticipantJoined');
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_JOINED);
    }

    _onSessionConnected() {
      console.log('onSessionConnected');
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_SESSION_CONNECTED);
    }

    _onRemoteVideo(sessionId, track) {
      console.log('onRemoteVideo ' + sessionId + ' track ' + track);

      let participant = track.getParticipantId();
      if (!this.remoteTracks[participant])
          this.remoteTracks[participant] = [];
      let idx = this.remoteTracks[participant].push(track);
      let baseId = participant.replace(/(-.*$)|(@.*$)/,'');
      let id = baseId + track.getType();

      let remoteConnectionList = this.state.remoteConnectionList;
      let audioConnection = null;
      let videoConnection = null;

      // check if the audio or video component for this base track
      // already exists
      let existingConnection = _.find(remoteConnectionList, (obj) => {
        return obj.baseId === baseId;
      });

      // if it does remove half populated connection and save the audio
      // or video part to be used with the new connection for this baseId
      if (existingConnection) {
        audioConnection = existingConnection.audio;
        videoConnection = existingConnection.video;
        remoteConnectionList = _.without(remoteConnectionList, existingConnection);
      }

      track.attach(id);
      if (track.getType() == "video") {
        console.log('onRemoteVideo video');
        videoConnection = {
          index: id,
          src: track.stream.jitsiObjectURL,
        }
      } else {
        console.log('onRemoteVideo audio');
        audioConnection = {
          index: id,
          src: track.stream.jitsiObjectURL,
        }
      }
      remoteConnectionList.push({
        video: videoConnection,
        audio: audioConnection,
        baseId: baseId,
        track: track,
      });
      this.setState({
        remoteConnectionList: remoteConnectionList,
      }, () => {
        if (videoConnection && audioConnection) {
          // notify only when both video and audio is available
          this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, {
            sessionId,
            track,
          });
        }
      });
    }

    _onRemoteParticipantLeft(id) {
      console.log('onRemoteParticipantLeft: ' + id);

      if (!this.remoteTracks[id]) {
        return;
      }

      let tracks = this.remoteTracks[id];
      for (let i = 0; i < tracks.length; i++) {
        let baseId = id.replace(/(-.*$)|(@.*$)/,'');
        //tracks[i].detach(trackId);

        let remoteConnectionList = this.state.remoteConnectionList;
        let existingConnection = _.find(remoteConnectionList, (obj) => {
          return obj.baseId === baseId;
        });

        remoteConnectionList = _.without(remoteConnectionList, existingConnection);
        this.setState({
          remoteConnectionList: remoteConnectionList,
        });
      }

      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, id);
    }

    _onSessionEnded(sessionId) {
      console.log('onSessionEnded: ' + sessionId);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_SESSION_ENDED, sessionId);
    }

    _onConnectionError(sessionId) {
      console.log('onConnectionError: ' + sessionId);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_CONNECTION_ERROR, sessionId);
    }

    _onNotificationReceived() {
      console.log('onNotificationReceived');
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_NOTIFICATION_RECEIVED);
    }

    _onAudioMute() {
      const isMuted = !this.state.isAudioMuted;
      this.setState({
        isAudioMuted: isMuted,
      }, () => {
        this.state.xrtcSDK.audioMuteUnmute(isMuted, (response) => {
          if (!response) {
            console.log("Local audio mute/unmute failed");
            this.setState({
              isAudioMuted: !this.state.isAudioMuted,
            });
          }
        });
        this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_AUDIO_MUTE);
      });
    }

    _onVideoMute() {
      const isMuted = !this.state.isVideoMuted;
      this.setState({
        isVideoMuted: isMuted,
      }, () => {
        this.state.xrtcSDK.videoMuteUnmute(isMuted, (response) => {
          if (!response) {
            this.setState({
              isVideoMuted: !this.state.isVideoMuted,
            });
          }
        });
        this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_VIDEO_MUTE);
      });
    }

    get localVideos() {
      return this.state.localConnectionList ? this.state.localConnectionList : [];
    }

    get remoteVideos() {
      return this.state.remoteConnectionList ? this.state.remoteConnectionList : [];
    }

    _getRootNodeId() {
      if (this.state.xrtcSDK &&
          this.state.xrtcSDK.connection &&
          this.state.xrtcSDK.connection.options) {
        return this.state.xrtcSDK.connection.options.eventNodeId;
      }

      return null;
    }

    _getRootChildNodeId() {
      if (this.state.xrtcSDK &&
          this.state.xrtcSDK.connection &&
          this.state.xrtcSDK.connection.options) {
        return this.state.xrtcSDK.connection.options.eventCnodeId;
      }

      return null;
    }

    render() {
      return (
        <ComposedComponent
          params={this.props.params}
          initializeWebRTC={this._initializeWebRTC.bind(this)}
          onAudioMute={this._onAudioMute.bind(this)}
          onVideoMute={this._onVideoMute.bind(this)}
          localVideos={this.localVideos}
          remoteVideos={this.remoteVideos}
          getRootNodeId={this._getRootNodeId.bind(this)}
          getRootChildNodeId={this._getRootChildNodeId.bind(this)}
          endSession={this._sessionEnd.bind(this)}
          addWebRTCListener={this.eventEmitter.addWebRTCListener.bind(this.eventEmitter)}
          removeWebRTCListener={this.eventEmitter.removeWebRTCListener.bind(this.eventEmitter)}
        />
      )
    }
  }
}
