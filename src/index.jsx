import React from 'react';
import _ from 'underscore';
import KeyMirror from 'keymirror'
import { EventEmitter } from 'events';
import Resolutions from './resolutions';
require('iris-js-sdk');
const request = require('request-promise-native');
const uuidV1 = require('uuid/v1');


export { default as IrisDialer } from './iris-dialer/components/IrisDialer';

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
  WEB_RTC_ON_CHAT_MESSAGE_RECEIVED: null,
  WEB_RTC_ON_REMOTE_SWITCH_STREAM: null,
  WEB_RTC_ON_CHAT_ACK_RECEIVED:null,
  WEB_RTC_ON_PARTICIPANT_VIDEO_MUTED:null,
  WEB_RTC_ON_PARTICIPANT_AUDIO_MUTED:null,
  WEB_RTC_ON_USER_PROFILE_CHANGE:null //!!!
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate local")
    return false
  }

  render() {
    return <div>
      <video ref='localVideo' autoPlay muted id={'localVideo1'} src={this.props.video ? URL.createObjectURL(this.props.video) : ''} />
    </div>
  }
}

export let RemoteVideo = class RemoteVideo extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {

      if (nextProps.video && this.props.video) {
        if (nextProps.video.id !== this.props.video.id) {
          return true
        }
      }

      return false
  }

  render() {
    return <div>
      <video ref='remoteVideo' autoPlay id={this.props.video.id} src={this.props.video ? URL.createObjectURL(this.props.video) : ''} />
    </div>
  }
}

export default (ComposedComponent) => {
  return class WebRTCBase extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        roomId: null,
        irisRtcConnection: null,
        irisRtcSession: null,
        irisRtcStream: null,
        userConfig: null,
        localConnectionList: [],
        remoteConnectionList: [],
        isSharingScreen: false,
      }

      this.localTracks = [];
      this.remoteTracks = [];
      this.eventEmitter = new WebRTCEvents();
    }

    _initializeWebRTC(config) {

      console.log(`initializeWebRTC -> userName ${config.userName}`);
      console.log(`initializeWebRTC -> routingId ${config.routingId}`);
      console.log(`initializeWebRTC -> roomId ${config.roomId}`);
      console.log(`initializeWebRTC -> roomName ${config.roomName}`)
      console.log(`initializeWebRTC -> domain ${config.domain}`);
      console.log(`initializeWebRTC -> resolution ${config.resolution}`);
      console.log(config.hosts);

      const traceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16); });
      let userConfig = {
        name:config.userName,
        password: '',
        roomId: config.roomId,
        roomName: config.roomName,
        domain: config.domain,
        token: config.token,
        routingId: config.routingId + '@' + config.domain,
        toRoutingId: config.toRoutingId + '@' + config.domain,
        fromTN: config.fromTN,
        toTN: config.toTN,
        anonymous: config.anonymous ? config.anonymous : false,
        traceId: traceId,
        callType: config.callType ? config.callType : 'video',
        loginType: 'connect',
        type: config.type ? config.type : "video",
        streamType:config.streamType ? config.streamType : "video",
        useBridge: true,
        //stream: 'sendonly',
        resolution: config.resolution ? config.resolution : "hd",
        eventManager: config.hosts.eventManagerUrl,
        notificationManager: config.hosts.notificationServer,
        UEStatsServer: '',
        urls : {
          eventManager: config.hosts.eventManagerUrl,
          notificationServer: config.hosts.notificationServer,
        },
        videoCodec: config.videoCodec ? config.videoCodec : "h264",
        // We get parsing errors from Iris JS SDK if userData isn't stringified
      }
      let userData = "";
      if(config.isPSTN){
        userConfig.cname = config.userName;
        userConfig.cid = config.userName;

        userData = JSON.stringify({
          "data": {
            "cid": config.userName,
            "cname": config.userName
          }
        })
      }else{
        userData = JSON.stringify({
          "data": {
            "cid": config.fromTN,
            "cname": config.userName
          },
          "notification": {
            "topic": config.domain + "/" + 'videocall',
            "srcTN": '',
            "type": 'videocall'
          }
        })
      }

      userConfig.userData = userData;

      let serverConfig = userConfig;
      console.log("init SDK");
      console.log(userConfig);

      const connection = new IrisRtcConnection();
      if (!connection) {
        console.log('Failed to initialize IrisRtcConnection');
      }

      const session = new IrisRtcSession();
      if (!session) {
        console.log('Failed to initialize IrisRtcSession');
      }

      const stream = new IrisRtcStream();
      if (!stream) {
        console.log('Failed to initialize IrisRtcStream');
      }

      console.log(userConfig);

      this.setState({
        userConfig: userConfig,
        roomId: config.roomId,
        irisRtcConnection: connection,
        irisRtcSession: session,
        irisRtcStream: stream,
      }, () => {
        this.state.irisRtcConnection.onNotification = this._onNotificationReceived.bind(this);
        this.state.irisRtcConnection.onConnected = this._onConnected.bind(this);
        this.state.irisRtcConnection.onConnectionFailed = this._onConnectionFailed.bind(this);
        this.state.irisRtcConnection.onClose = this._onClose.bind(this);
        this.state.irisRtcConnection.onEvent = this._onEvent.bind(this);
        this.state.irisRtcConnection.onError = this._onError.bind(this);

        // TODO: handler needs update
        this.state.irisRtcStream.onLocalStream = this._onLocalStream.bind(this);
        this.state.irisRtcStream.irisVideoStreamStopped = this._onStreamStopped.bind(this)

        this.state.irisRtcSession.onRemoteStream = this._onRemoteStream.bind(this);
        this.state.irisRtcSession.onSessionCreated = this._onSessionCreated.bind(this);
        this.state.irisRtcSession.onSessionConnected = this._onSessionConnected.bind(this);
        this.state.irisRtcSession.onSessionParticipantJoined = this._onSessionParticipantJoined.bind(this);
        this.state.irisRtcSession.onSessionParticipantLeft = this._onSessionParticipantLeft.bind(this);
        this.state.irisRtcSession.onSessionEnd = this._onSessionEnd.bind(this);
        this.state.irisRtcSession.onChatMessage = this._onChatMessage.bind(this);
        this.state.irisRtcSession.onChatAck = this._onChatAck.bind(this);
        this.state.irisRtcSession.onParticipantVideoMuted = this._onParticipantVideoMuted.bind(this);
        this.state.irisRtcSession.onParticipantAudioMuted = this._onParticipantAudioMuted.bind(this);
        this.state.irisRtcSession.onUserProfileChange = this._onUserProfileChange.bind(this);
        this.state.irisRtcSession.onError = this._onError.bind(this);
        this.state.irisRtcSession.onEvent = this._onEvent.bind(this);
        this.state.irisRtcSession.onDominantSpeakerChanged = this._onDominantSpeakerChanged.bind(this);

        IrisRtcConfig.updateConfig(this.state.userConfig);

        this.state.irisRtcConnection.connect(
          this.state.userConfig.token,
          this.state.userConfig.routingId
        );
      });
    }

    _createSession(){
      this.state.irisRtcSession.createSession(
        this.state.userConfig,
        this.state.irisRtcConnection,
        this.state.localConnectionList[0]
      );
    }

     //To createStream in case of non-anonymous incoming calls or notification based calls
    _createStream(streamConfig){
      let userConfig = this.state.userConfig;
      userConfig.streamConfig = streamConfig;

      this.setState(userConfig:userConfig);

      this.state.irisRtcStream.createStream(streamConfig);
    }

    _sendChatMessage(userId, message) {
      console.log('Sending message from ' + userId + ' in _sendChatMessage saying: ' + message);
      this.state.irisRtcSession.sendChatMessage(uuidV1(), message);
    }

    _setDisplayName(name){
      console.log('Set display name to '+name);
      this.state.irisRtcSession.setDisplayName(name);
    }

    _onChatMessage(chatMsgJson) {
      console.log('_onChatMessage' + 'message json ' + chatMsgJson);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_CHAT_MESSAGE_RECEIVED, chatMsgJson);
    }

    _onChatAck(chatAckJson){
      console.log('_onChatAck' + 'ack ' + chatAckJson);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_CHAT_ACK_RECEIVED, chatAckJson);
    }

    _onParticipantVideoMuted(jid, mute){
      console.log('_onParticipantVideoMuted' + jid + ' muted ' + mute);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_PARTICIPANT_VIDEO_MUTED, {jid:jid, muted:mute});
    }

    _onParticipantAudioMuted(jid, mute){
      console.log('_onParticipantAudioMuted' + jid + ' muted ' + mute);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_PARTICIPANT_AUDIO_MUTED, {jid:jid, muted: mute});
    }

    _onUserProfileChange(id, profileJson) {
      console.log('_onUserProfileChange' + id + ' profileJson ' + profileJson);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_USER_PROFILE_CHANGE, {jid: id, name: profileJson.displayName});
    }

    _onDominantSpeakerChanged(dominantSpeakerEndpoint) {
      console.log('onDominantSpeakerChanged' + dominantSpeakerEndpoint);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_DOMINANT_SPEAKER_CHANGED, dominantSpeakerEndpoint);
    }

    _sessionEnd() {
      console.log('_sessionEnd');
      if (this.state.irisRtcSession) {
        this.state.irisRtcSession.endSession();
        this.setState({ irisRtcStream: null, localConnectionList: [], remoteConnectionList: [] });
      }
    }

    _onSessionParticipantLeft(roomName, sessionId, participantJid, closeSession) {
      console.log(`_onSessionParticipantLeft: roomName(${roomName}),
        sessionId: ${sessionId},
        participantJid: ${participantJid},
        closeSession: ${closeSession}`);

      if (closeSession) {
        this.setState({
          remoteConnectionList: []
        }, () => {
          this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, {
            roomName,
            sessionId,
            participantJid,
            closeSession
          });
        });
      } else {
        let remoteConnectionList = this.state.remoteConnectionList;
        remoteConnectionList.forEach((item, index, object) => {
          if (item.participantJid.includes(participantJid)) {
            object.splice(index, 1);
          }
        });
        this.setState({
          remoteConnectionList
        }, () => {
          this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_REMOTE_PARTICIPANT_LEFT, {
            roomName,
            sessionId,
            participantJid,
            closeSession
          });
        });
      }
    }

    _onSessionParticipantJoined(remoteUserInfo) {
      console.log('_onSessionParticipantJoined');
      console.log(remoteUserInfo);
    }

    _onSessionError(error) {
      console.log(error);
    }

    _onSessionJoined() {
      console.log('in _onSessionJoined');
    }

    _onError(errorTitle, errorCode) {
      console.log(`ERROR: ${errorTitle}: ${errorCode}`);
    }

    _onClose() {
      console.log('onClose');
    }

    _onEvent(event) {
      console.log(`onEvent: ${JSON.stringify(event)}`);
    }

    _createConstraints() {
      //fill the constraints.video part
      let constraints = {};
      if (this.state.userConfig.streamType == "video") {
        constraints.video = {mandatory: {}, optional: [] };
        constraints.video.optional.push({googLeakyBucket: true });
        const width = Resolutions[this.state.userConfig.resolution].width;
        const height = Resolutions[this.state.userConfig.resolution].height;
        constraints.video.mandatory.minWidth = width ;
        constraints.video.mandatory.minHeight = height;
      }
      else if (this.state.userConfig.streamType == "audio") {
        constraints.video = false;
      }

      //fill the audio part
      constraints.audio = {mandatory: {}, optional: [] };
      constraints.audio.optional.push({ googEchoCancellation: true },
        { googAutoGainControl: true },
        { googNoiseSupression: true },
        { googHighpassFilter: true },
        { googNoisesuppression2: true },
        { googEchoCancellation2: true },
        { googAutoGainControl2: true });

      return constraints
    }

    _onConnected() {
      console.log('_onConnected');
      // const streamConfig = {
      //   "streamType": this.state.userConfig.streamType,
      //   "resolution": this.state.userConfig.resolution,
      //   "constraints": {
      //     audio: true,
      //     video: true
      //     } // contraints required to create the stream (optional)
      // }
      let constraints = {}
      if (this.state.userConfig.resolution === "auto") {
        constraints = {
            audio: true,
            video: true
            }
      }
      else {
        constraints = this._createConstraints()
      }

      const streamConfig = {
        "streamType": this.state.userConfig.streamType,
        "resolution": this.state.userConfig.resolution,
        "constraints": constraints
      }

      this.state.irisRtcStream.createStream(streamConfig);
    }

    _onLocalStream(stream) {
      console.log('_onLocalStream');
      console.log(stream);

      let localConnectionList = this.state.localConnectionList;
      localConnectionList.push(stream);

      if (localConnectionList.length === 2) {
        localConnectionList.pop()
      }

      this.setState({
        localConnectionList
      }, () => {
        if (!this.state.isSharingScreen || this.state.userConfig.anonymous) {
          this.state.irisRtcSession.createSession(
            this.state.userConfig,
            this.state.irisRtcConnection,
            stream
          );
        }
        this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_LOCAL_VIDEO);
      });
    }


    _onStreamStopped() {
      //this probably needs some checks. Because stop of stream doesn't
      //necessarily imply that the screen share ended. Could've been something
      //else.
      //Although the endscreenshare function is not specific to sharing screen,
      //so this is more of a naming pattern issue than a bug
      this._endScreenshare()
    }

    _onRemoteStream(stream) {
      console.log('_onRemoteStream');
      console.log(stream);

      let remoteConnectionList = this.state.remoteConnectionList;

      //check if the remote participant retained the same Jid but got a new ID
      let oldIDStream = remoteConnectionList.find(function(connection) {
        return (connection.participantJid === stream.participantJid && connection.id !== stream.id)
      })

      remoteConnectionList = remoteConnectionList.filter(function(connection) {
        return connection.participantJid !== stream.participantJid;
      });

      remoteConnectionList.push(stream);
      this.setState({
        remoteConnectionList
      }, () => {
        this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_REMOTE_VIDEO, stream);
        // emit event with old and new id's
        let newID = stream.id
        if (oldIDStream && newID) {
          let oldID = oldIDStream.id
          this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_REMOTE_SWITCH_STREAM, {
            oldID,
            newID,
          });
        }
      });
    }

    _onUserJoined(id, participant) {
      console.log('_onUserJoined');
      console.log(id);
      console.log(participant);
    }

    _onWebRTCConnect(response) {
      console.log('createSession callback');
      console.log(response);
    }

    _onLocalAudio() {
      console.log('onLocalAudio');
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_LOCAL_AUDIO);
    }

    _onSessionCreated(roomName, sessionId, myJid) {
      console.log('onSessionCreated - session created with ' + sessionId + ' and user joined in ' + roomName + ' myJid ' + myJid);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_SESSION_CREATED, {
        sessionId,
        roomName,
        myJid
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

    _onSessionEnd(sessionId) {
      console.log('onSessionEnded: ' + sessionId);
      this.setState({
        remoteConnectionList: []
      });
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_SESSION_ENDED, sessionId);
    }

    _onConnectionFailed(sessionId) {
      console.log('onConnectionError: ' + sessionId);
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_CONNECTION_ERROR, sessionId);
    }

    _onNotificationReceived() {
      console.log('onNotificationReceived');
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_NOTIFICATION_RECEIVED);
    }

    _onAudioMute() {
      this.state.irisRtcSession.audioMuteToggle();
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_AUDIO_MUTE);
    }

    _onVideoMute() {
      this.state.irisRtcSession.videoMuteToggle();
      this.eventEmitter.emitWebRTCEvent(WebRTCConstants.WEB_RTC_ON_VIDEO_MUTE);
    }

    get localVideos() {
      return this.state.localConnectionList ? this.state.localConnectionList : [];
    }

    get remoteVideos() {
      return this.state.remoteConnectionList ? this.state.remoteConnectionList : [];
    }

    _startScreenshare(screenSourceId) {
      console.log('----> STARTING SCREEN SHARE');
      const localConnectionList = this.state.localConnectionList;
      if (localConnectionList !== undefined && localConnectionList.length > 0) {
        // replace the current local video with the screenshare (if one exists)
        localConnectionList.pop();
        this.setState({ localConnectionList: localConnectionList });
      }

      const screenShareConfig = {
        constraints: {
          audio: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: screenSourceId
              }

          },
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: screenSourceId,
              maxWidth: 1920,
              maxHeight: 1080
            },
            optional: [{
              googTemporalLayeredScreencast: true
            }]
          },
        },
        screenShare: true
      };

      this.setState({ isSharingScreen: true }, () => {
        console.log('----> screenShareConfig: ' + JSON.stringify(screenShareConfig));
        this.state.irisRtcSession.switchStream(this.state.irisRtcStream, screenShareConfig);
        console.log("Peer connection: ", this.state.irisRtcSession.peerconnection);
        console.log("Connection.xmpp: ", this.state.irisRtcSession.connection.xmpp);
      });
    }

    _endScreenshare() {
      console.log('----> ENDING SCREEN SHARE');

      new Promise((resolve, reject) => {
        const localConnectionList = this.state.localConnectionList;
        if (localConnectionList !== undefined && localConnectionList.length > 0) {
          // replace the current local video with the screenshare (if one exists)
          const screenshareConnection = localConnectionList.pop();
          // stop the tracks so that the browser knows we're done sharing the screen
          // if we don't do this, chrome's screenshare bar won't close
          //screenshareConnection.video.track.stream.getTracks().map((track) => {
          screenshareConnection.getVideoTracks().map(function (track) {
            if (track.stop) {
              track.stop();
            }
          });
          this.setState({ localConnectionList: localConnectionList }, () => resolve());
        }
      })
        .then(() => {
          const streamConfig = {
            "streamType": "video",
            "resolution": this.state.userConfig.resolution,
            "constraints": {
              audio: true,
              video: true
            } // contraints required to create the stream (optional)
          };

          this.setState({ isSharingScreen: false }, () => {
            this.state.irisRtcSession.switchStream(this.state.irisRtcStream, streamConfig);
          });
        })
        .catch((error) => console.error('ERROR: ' + error));
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          params={this.props.params}
          initializeWebRTC={this._initializeWebRTC.bind(this)}
          createSession={this._createSession.bind(this)}
          isWebRTCInitialized={(this.state.irisRtcSession && this.state.irisRtcStream && this.state.irisRtcConnection)}
          onAudioMute={this._onAudioMute.bind(this)}
          onVideoMute={this._onVideoMute.bind(this)}
          localVideos={this.localVideos}
          remoteVideos={this.remoteVideos}
          endSession={this._sessionEnd.bind(this)}
          addWebRTCListener={this.eventEmitter.addWebRTCListener.bind(this.eventEmitter)}
          removeWebRTCListener={this.eventEmitter.removeWebRTCListener.bind(this.eventEmitter)}
          sendChatMessage={this._sendChatMessage.bind(this)}
          startScreenshare={this._startScreenshare.bind(this)}
          endScreenshare={this._endScreenshare.bind(this)}
          isSharingScreen={this.state.isSharingScreen}
          setDisplayName={this._setDisplayName.bind(this)}
        />
      )
    }
  }
}
