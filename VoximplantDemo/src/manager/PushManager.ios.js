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
      console.log('Push manager ios, register token: ' + token);
      this.pushToken = token;
    });

    VoipPushNotification.addEventListener('notification', notification => {
      console.log(
        'PushManager: ios: push notification is received: ' +
          JSON.stringify(notification),
      );

      if (VoipPushNotification.wakeupByPush) {
        VoipPushNotification.wakeupByPush = false;
      }
      LoginManager.getInstance().pushNotificationReceived(notification);
    });
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
