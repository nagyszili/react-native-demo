/*
 * Copyright (c) 2011-2021, Zingaya, Inc. All rights reserved.
 */

'use strict';

import {Voximplant} from 'react-native-voximplant';
import RNCallKeep from 'react-native-callkeep';
import * as RootNavigation from '../routes/routes';
import CallManager from './CallManager';

export default class CallKitManager {
  static myInstance = null;
  callKitUuid = undefined;
  withVideo = false;
  callId = undefined;

  static getInstance() {
    if (this.myInstance === null) {
      this.myInstance = new CallKitManager();
    }
    return this.myInstance;
  }

  constructor() {
    const options = {
      android: {
        // selfManaged: true,
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
      },
      ios: {
        appName: 'VoximplantDemo',
      },
    };
    RNCallKeep.setup(options);

    RNCallKeep.addEventListener(
      'didReceiveStartCallAction',
      this._onRNCallKeepDidReceiveStartCallAction,
    );
    RNCallKeep.addEventListener(
      'answerCall',
      this._onRNCallKeepPerformAnswerCallAction,
    );
    RNCallKeep.addEventListener(
      'endCall',
      this._onRNCallKeepPerformEndCallAction,
    );
    RNCallKeep.addEventListener(
      'didActivateAudioSession',
      this._onRNCallKeepDidActivateAudioSession,
    );
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      this._onRNCallKeepDidDisplayIncomingCall,
    );
    RNCallKeep.addEventListener(
      'didPerformSetMutedCallAction',
      this._onRNCallKeepDidPerformSetMutedCallAction,
    );
  }

  addIncomingCall({callId, withVideo, callKitUUID}) {
    console.log('CallKitManager: addIncomingCall ', {
      callId,
      withVideo,
      callKitUUID,
    });
    if (callKitUUID) {
      this.callKitUuid = callKitUUID;
    }
    this.withVideo = withVideo;
    this.callId = callId;
  }

  showIncomingCall(isVideoCall, displayName, callId, callKitUUID) {
    console.log('CallKitManager: showIncomingCall ', {
      isVideoCall,
      displayName,
      callId,
      callKitUUID,
    });
    this.callKitUuid = callKitUUID;
    this.withVideo = isVideoCall;
    this.callId = callId;
    RNCallKeep.displayIncomingCall(
      this.callKitUuid,
      displayName,
      displayName,
      'generic',
      isVideoCall,
    );
  }

  startOutgoingCall(isVideoCall, displayName, callId, callKitUUID) {
    this.callKitUuid = callKitUUID;
    this.withVideo = isVideoCall;
    this.callId = callId;
    RNCallKeep.startCall(
      this.callKitUuid,
      displayName,
      displayName,
      'generic',
      isVideoCall,
    );
  }

  reportOutgoingCallConnected() {
    RNCallKeep.reportConnectedOutgoingCallWithUUID(this.callKitUuid);
  }

  endCall() {
    if (this.callKitUuid) {
      RNCallKeep.endCall(this.callKitUuid);
      this.callKitUuid = null;
    }
  }

  _onRNCallKeepDidReceiveStartCallAction = event => {
    console.log('CallKitManager: _onRNCallKeepDidReceiveStartCallAction');
  };

  _onRNCallKeepPerformAnswerCallAction = event => {
    console.log(
      'CallKitManager: _onRNCallKeepPerformAnswerCallAction' +
        JSON.stringify(event) +
        this.callId,
    );
    // const {callUUID} = event || {};
    // this.callKitUuid = callUUID;
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitConfigureAudioSession();
    RootNavigation.navigate('Call', {
      callId: this.callId,
      isVideo: this.withVideo,
      isIncoming: true,
    });
  };

  _onRNCallKeepPerformEndCallAction = event => {
    console.log('CallKitManager: _onRNCallKeepPerformEndCallAction');
    CallManager.getInstance().endCall();
    this.callKitUuid = null;
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStopAudio();
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitReleaseAudioSession();
  };

  _onRNCallKeepDidActivateAudioSession = () => {
    console.log('CallKitManager: _onRNCallKeepDidActivateAudioSession');
    Voximplant.Hardware.AudioDeviceManager.getInstance().callKitStartAudio();
  };

  _onRNCallKeepDidDisplayIncomingCall = event => {
    // const {voximplant, callUUID} = event || {};
    // const {video, callid} = voximplant || {};
    // this.callKitUuid = callUUID;
    // this.withVideo = video;
    // this.callId = callid;
    console.log(
      'CallKitManager: _onRNCallKeepDidDisplayIncomingCall' +
        JSON.stringify({
          callKitUuid: this.callKitUuid,
          withVideo: this.withVideo,
          callId: this.callId,
        }),
    );
  };

  _onRNCallKeepDidPerformSetMutedCallAction = (muted, callUUID) => {
    /* You will get this event after the system or the user mutes a call
     * You can use it to toggle the mic on your custom call UI
     */
  };
  _onRNCallKeepDidShowIncomingCallUi = event => {
    console.log(
      'CallKitManager: _onRNCallKeepDidShowIncomingCallUi' +
        JSON.stringify(event),
    );
  };
}
