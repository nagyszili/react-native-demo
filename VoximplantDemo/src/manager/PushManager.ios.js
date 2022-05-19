/*
 * Copyright (c) 2011-2021, Zingaya, Inc. All rights reserved.
 */

'use strict';

import LoginManager from './LoginManager';
import VoipPushNotification from 'react-native-voip-push-notification';
import CallManager from './CallManager';

class PushManager {
  pushToken = '';
  constructor() {
    console.log('Push manager ios');
    VoipPushNotification.registerVoipToken();
    VoipPushNotification.addEventListener('register', token => {
      this.onRegistered(token);
    });

    VoipPushNotification.addEventListener('notification', notification => {
      this.onNotificationReceived(notification);
    });

    VoipPushNotification.addEventListener('didLoadWithEvents', events => {
      this.onLoadWithEvents(events);
    });
  }
  onRegistered(token) {
    console.log('Push manager ios, register token: ' + token);
    this.pushToken = token;
  }

  onNotificationReceived(notification) {
    console.log(
      'PushManager: ios: push notification is received: ' +
        JSON.stringify(notification),
    );

    if (VoipPushNotification.wakeupByPush) {
      VoipPushNotification.wakeupByPush = false;
    }
    const currentAppState = CallManager.getInstance().currentAppState;
    console.log('PushManager: ios: currentAppState: ' + currentAppState);
    if (currentAppState !== 'active') {
      LoginManager.getInstance().pushNotificationReceived(notification);
    }
  }

  onLoadWithEvents(events) {
    console.log(
      'PushManager: ios: didLoadWithEvents: ' + JSON.stringify(events),
    );
    // --- this will fire when there are events occured before js bridge initialized
    // --- use this event to execute your event handler manually by event type

    if (!events || !Array.isArray(events) || events.length < 1) {
      return;
    }
    for (let voipPushEvent of events) {
      let {name, data} = voipPushEvent;
      if (
        name ===
        VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent
      ) {
        this.onRegistered(data);
      } else if (
        name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
      ) {
        this.onNotificationReceived(data);
      }
    }
  }

  init() {
    console.log('PushManager init');
  }

  getPushToken() {
    return this.pushToken;
  }
}

const pushManager = new PushManager();
export default pushManager;
