import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import hiv from '../assets/img/hiv.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifications from '../untils/notification';
import * as RNLocalize from 'react-native-localize';
import {formatDate} from '../untils/helperDate';

type SchduleType = {
  startDate: string;
  endDate: string;
  time: string;
};

export default function Schedule({navigation}) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const [isDatePickerVisibleStart, setDatePickerVisibilityStart] =
    useState<boolean>(false);
  const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] =
    useState<boolean>(false);

  const showDatePickerStart = () => {
    setDatePickerVisibilityStart(true);
  };

  const hideDatePickerStart = () => {
    setDatePickerVisibilityStart(false);
  };

  const handleConfirmStart = (date: Date) => {
    const selectedDate = formatDate(date);
    if (!endDate || date <= new Date(endDate)) {
      setStartDate(selectedDate);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Tanggal mulai tidak boleh lebih dari tanggal selesai',
      });
    }
    hideDatePickerStart();
  };

  const showDatePickerEnd = () => {
    setDatePickerVisibilityEnd(true);
  };

  const hideDatePickerEnd = () => {
    setDatePickerVisibilityEnd(false);
  };

  const handleConfirmEnd = (date: Date) => {
    const selectedDate = formatDate(date);
    if (!startDate || date >= new Date(startDate)) {
      setEndDate(selectedDate);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Tanggal selesai tidak boleh kurang dari tanggal mulai',
      });
    }
    hideDatePickerEnd();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (date: Date) => {
    setSelectedTime(date);
    hideTimePicker();
  };

  const handleSchedule = () => {
    saveSchedule().then(() => navigation.replace('Home'));
  };

  const loadSchedule = async () => {
    try {
      const defaultValue = await AsyncStorage.getItem('schedule');
      if (defaultValue !== null) {
        const scheduleValue: SchduleType = JSON.parse(defaultValue);
        const end = scheduleValue.endDate ? scheduleValue.endDate : null;
        const start = scheduleValue.startDate ? scheduleValue.startDate : null;
        const time = scheduleValue.time
          ? convertTimeToDateFormat(scheduleValue.time)
          : undefined;
        setEndDate(end);
        setStartDate(start);
        setSelectedTime(time);
      }
    } catch (error) {
      console.log('Error loading default value:', error);
    }
  };

  const saveSchedule = async () => {
    try {
      const time = selectedTime
        ? selectedTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

      const start = startDate ? startDate.substr(0, 10) : '';
      const end = endDate ? endDate.substr(0, 10) : '';

      const scheduleValue = JSON.stringify({
        startDate: start,
        endDate: end,
        time: time,
      });

      const newScheduleMark = createMarkedDates(start, end);
      const oldScheduleMark = await AsyncStorage.getItem('scheduleMark');

      const old = oldScheduleMark ? JSON.parse(oldScheduleMark) : {};

      const updateScheduleMark = {...newScheduleMark};

      for (const key in old) {
        if (newScheduleMark.hasOwnProperty(key)) {
          updateScheduleMark[key] = {selected: false, ...old[key]};
        }
      }
      const scheduleMark = JSON.stringify(updateScheduleMark);

      await AsyncStorage.setItem('schedule', scheduleValue);
      await AsyncStorage.setItem('scheduleMark', scheduleMark);
    } catch (error) {
      console.log('Error loading default value:', error);
    }
  };

  function createMarkedDates(startDate: string, endDate: string) {
    Notifications.cancelNotification();
    const markedDates: any = {};

    // Mengubah tanggal menjadi objek Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Menyimpan tanggal sebagai kunci dan value { marked: true }
    while (start <= end) {
      const formattedDate = formatDate(start);
      markedDates[formattedDate] = {marked: true, selected: false};
      const time = selectedTime
        ? selectedTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '10:00';
      if (combineDateAndTime(formattedDate, time) > new Date(Date.now())) {
        setNotif(combineDateAndTime(formattedDate, time));
      }
      start.setDate(start.getDate() + 1);
    }
    return markedDates;
  }

  const combineDateAndTime = (dateString, timeString) => {
    const [year, month, day] = dateString.split('-');
    let [hours, minutes, period] = timeString.split(/:|\s+/);

    if (period) {
      hours = parseInt(hours);

      if (period === 'PM' && hours != 12) {
        hours += 12; // Tambahkan 12 jam jika waktu adalah PM
      }
    } else {
      [hours, minutes] = hours.split('.');
    }

    const combinedDate = new Date(year, month - 1, day, hours, minutes);

    return combinedDate;
  };

  function convertTimeToDateFormat(timeString: string) {
    // Mendapatkan waktu dalam format 24 jam dari string waktu
    let [hours, minutes, meridiem] = timeString.split(/:|\s+/);

    if (meridiem) {
      if (meridiem === 'PM' && hours !== '12') {
        hours = String(Number(hours) + 12);
      }
      if (meridiem === 'AM' && hours === '12') {
        hours = '00';
      }
    } else {
      [hours, minutes] = hours.split('.');
    }

    // Mendapatkan tanggal saat ini
    const currentDate = new Date();

    // Mengatur jam dan menit pada tanggal saat ini
    currentDate.setHours(parseInt(hours));
    currentDate.setMinutes(parseInt(minutes));

    return currentDate;
  }

  useEffect(() => {
    loadSchedule();
  }, []);

  const setNotif = date => {
    Notifications.schduleNotification(date);
  };

  return (
    <View style={styles.root}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignContent: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 30,
        }}>
        <Text style={{color: '#000', fontSize: 24, fontWeight: '600'}}>
          Jadwal
        </Text>
        <Image source={hiv} style={{width: 30, height: 30}} />
      </View>
      <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
        <View style={{marginBottom: 10}}>
          <Text style={{color: '#000', marginBottom: 2}}>Tanggal Mulai</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              padding: 13,
            }}
            onPress={showDatePickerStart}>
            <Text style={{color: '#000', fontSize: 16}}>
              {startDate ? startDate.substr(0, 10) : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={{color: '#000', marginBottom: 2}}>Tanggal Selesai</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              padding: 13,
            }}
            onPress={showDatePickerEnd}>
            <Text style={{color: '#000', fontSize: 16}}>
              {endDate ? endDate.substr(0, 10) : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={{color: '#000', marginBottom: 2}}>Waktu</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              padding: 13,
            }}
            onPress={showTimePicker}>
            <Text style={{color: '#000', fontSize: 16}}>
              {selectedTime
                ? selectedTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisibleStart}
          mode="date"
          date={startDate ? new Date(startDate) : new Date()}
          onConfirm={handleConfirmStart}
          onCancel={hideDatePickerStart}
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisibleEnd}
          mode="date"
          date={endDate ? new Date(endDate) : new Date()}
          onConfirm={handleConfirmEnd}
          onCancel={hideDatePickerEnd}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          date={selectedTime ? new Date(selectedTime) : new Date()}
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      </View>
      <View style={{alignSelf: 'flex-end'}}>
        {/* <TouchableOpacity
          onPress={() =>
            Notifications.schduleNotification(new Date(Date.now() + 5 * 1000))
          }>
          <Text>Test</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          disabled={
            endDate == null ||
            startDate == null ||
            selectedTime == null ||
            selectedTime == undefined
          }
          style={{
            borderRadius: 10,
            borderWidth: 2,
            padding: 10,
            marginBottom: 40,
            width: 150,
          }}
          onPress={handleSchedule}>
          <Text style={{color: '#000', textAlign: 'center', fontSize: 16}}>
            Selesai
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    alignContent: 'center',
  },
  imageremovebgpreview$1: {
    display: 'flex',
    flexDirection: 'column',
    width: 227,
    height: 240,
  },
  hitrack: {
    height: 48,
    fontSize: 40,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'top',
    color: '#ed3f36',
  },
  logo: {
    width: 40,
    height: 40,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
