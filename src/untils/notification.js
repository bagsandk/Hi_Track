import PushNotification from 'react-native-push-notification';
import {navigate} from '../components/RootNavigation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { formatDate } from './helperDate';
class Notifications {
  constructor() {
    PushNotification.configure({
      onRegister: function (token) {
        // console.log("TOKEN:", token);
      },

      onNotification: function (notification) {
        
        console.log('NOTIFICATION:', notification.data.day);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
        navigate('Calendar', {
          day: notification.data.day,
        });
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: false,
        sound: false,
      },
    });

    PushNotification.createChannel(
      {
        channelId: 'reminders', // (required)
        channelName: 'Task reminder notifications', // (required)
        channelDescription: 'Reminder for any tasks',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN --- ', rn);
    });
  }

  cancelNotification() {
    PushNotification.cancelAllLocalNotifications();
  }
  schduleNotification(date) {
    const day = formatDate(date)
    console.log(date)
    console.log(day)
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: '🔔 Pengingat!',
      message: 'Silahkan Minum Obat',
      userInfo: {day: day}, // (optional) default: {} (using null throws a JSON value '<null>' error)
      soundName: 'default',
      date,
    });
  }
}

export default new Notifications();
