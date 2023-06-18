import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';
import hiv from '../assets/img/hiv.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifications from '../untils/notification';

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
    const selectedDate = date.toISOString();
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
    const selectedDate = date.toISOString();
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
    saveSchedule().then(() => {
      navigation.navigate('Home');
    });
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

      const old = oldScheduleMark ? JSON.parse(oldScheduleMark) : null;

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

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function createMarkedDates(startDate: string, endDate: string) {
    const markedDates: any = {};

    // Mengubah tanggal menjadi objek Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Menyimpan tanggal sebagai kunci dan value { marked: true }
    while (start <= end) {
      const formattedDate = formatDate(start);
      markedDates[formattedDate] = {marked: true};
      const time = selectedTime
        ? selectedTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '10:00 AM';
      setNotif(combineDateAndTime(formattedDate, time));
      start.setDate(start.getDate() + 1);
    }
    return markedDates;
  }

  const combineDateAndTime = (dateString, timeString) => {
    const [year, month, day] = dateString.split('-');
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);

    if (period === 'PM' && hours != 12) {
      hours += 12; // Tambahkan 12 jam jika waktu adalah PM
    }

    console.log(hours)

    // console.log(year, (month - 1), day, hours, minutes);
    const combinedDate = new Date(year, month - 1, day, hours, minutes);
    console.log(combinedDate)

    return combinedDate;
  };

  function convertTimeToDateFormat(timeString: string) {
    // Mendapatkan waktu dalam format 24 jam dari string waktu
    const timeParts = timeString.split(' ');
    const time = timeParts[0];
    const meridiem = timeParts[1];
    let [hours, minutes] = time.split(':');

    // Mengonversi waktu ke format 24 jam
    if (meridiem === 'PM' && hours !== '12') {
      hours = String(Number(hours) + 12);
    }
    if (meridiem === 'AM' && hours === '12') {
      hours = '00';
    }

    // Mendapatkan tanggal saat ini
    const currentDate = new Date();

    // Mengatur jam dan menit pada tanggal saat ini
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);

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
          marginTop: 20,
        }}>
        <Text style={{fontSize: 24, fontWeight: '600'}}>Jadwal</Text>
        <Image source={hiv} style={{width: 30, height: 30}} />
        <TouchableOpacity onPress={setNotif}>
          <Text>Test</Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
        <View style={{marginBottom: 10}}>
          <Text style={{marginBottom: 2}}>Tanggal Mulai</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              padding: 13,
            }}
            onPress={showDatePickerStart}>
            <Text style={{fontSize: 16}}>
              {startDate ? startDate.substr(0, 10) : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={{marginBottom: 2}}>Tanggal Selesai</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              padding: 13,
            }}
            onPress={showDatePickerEnd}>
            <Text style={{fontSize: 16}}>
              {endDate ? endDate.substr(0, 10) : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 10}}>
          <Text style={{marginBottom: 2}}>Waktu</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: '100%',
              padding: 13,
            }}
            onPress={showTimePicker}>
            <Text style={{fontSize: 16}}>
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
          onConfirm={handleConfirmStart}
          onCancel={hideDatePickerStart}
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisibleEnd}
          mode="date"
          onConfirm={handleConfirmEnd}
          onCancel={hideDatePickerEnd}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
      </View>
      <View style={{alignSelf: 'flex-end'}}>
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
            width: 150,
          }}
          onPress={handleSchedule}>
          <Text style={{textAlign: 'center', fontSize: 16}}>Selesai</Text>
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
