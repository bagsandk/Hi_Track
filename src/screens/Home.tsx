import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import hiv from '../assets/img/hiv.png';
import idi from '../assets/img/idi.png';
import malahayati from '../assets/img/malahayati.png';
import puskes from '../assets/img/puskes.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

export default function Home({navigation}) {
  const [scheduleMark, setScheduleMark] = useState({});
  const [age, setAge] = useState(null);
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState({});

  const getHari = dateString => {
    const mount = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    var d = new Date(dateString);
    return `${d.getDate()} ${mount[d.getMonth()]} ${d.getFullYear()}`;
  };
  const loadSchedule = async () => {
    console.log('x');
    try {
      const defaultValue = await AsyncStorage.getItem('scheduleMark');
      const prof = await AsyncStorage.getItem('profile');
      const sche = await AsyncStorage.getItem('schedule');
      if (prof !== null) {
        const profileValue = JSON.parse(prof);
        const agee = profileValue.age;
        const namee = profileValue.name;
        setAge(agee);
        setName(namee);
        const scheduleValue = sche ? JSON.parse(sche) : null;
        setSchedule(scheduleValue);
      }
      if (defaultValue !== null) {
        const scheduleMark = defaultValue ? JSON.parse(defaultValue) : {};
        setScheduleMark(scheduleMark);
      }
    } catch (error) {
      console.log('Error loading default value:', error);
    }
  };

  const handlePressDay = day => {
    if (scheduleMark.hasOwnProperty(day.dateString)) {
      navigation.navigate('Calendar', {
        info: scheduleMark[day.dateString],
        day: day.dateString,
      });
    } else {
      navigation.navigate('Calendar', {info: null, day: day.dateString});
    }
  };
  const handleEdit = () => {
    navigation.replace('Profil');
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSchedule();
    }, []),
  );

  useEffect(() => {
    loadSchedule();
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView>
        <View style={{flex: 1}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignContent: 'flex-end',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <Text style={{fontSize: 24, color: '#000', fontWeight: '600'}}>
              Hi Track
            </Text>
            <Image source={hiv} style={{width: 30, height: 30}} />
          </View>
          <View
            style={{
              borderWidth: 1,
              marginTop: 30,
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 5,
              marginBottom: 10,
            }}>
            <View style={{}}>
              <Text style={{fontSize: 24, color: '#000', fontWeight: '600'}}>
                {name ? name : ' - '}
              </Text>
              <Text>{age ? age : ' - '} tahun</Text>
            </View>

            <View style={{marginTop: 5}}>
              <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>
                Jadwal :
              </Text>
              <Text style={{color: '#595959'}}>
                {schedule.startDate ? getHari(schedule.startDate) : ' - '} -{' '}
                {schedule.endDate ? getHari(schedule.endDate) : ' - '}
              </Text>
              <Text style={{color: '#595959'}}>
                Setiap {schedule.time ? schedule.time : ' - '}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleEdit}
              style={{alignSelf: 'flex-end', margin: 10}}>
              <Text style={{color: '#004AA1'}}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Calendar
            style={{width: '100%', borderWidth: 1, borderRadius: 10}}
            onDayPress={handlePressDay}
            markedDates={{
              ...scheduleMark,
            }}
          />
        </View>
        <View>
          <Image
            source={hiv}
            style={{
              marginTop: 20,
              width: 50,
              height: 50,
              alignSelf: 'center',
              justifyContent: 'flex-end',
              alignContent: 'flex-end',
            }}
          />
        </View>
        <View
          style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
          <Image source={malahayati} style={styles.logo} />
          <Image source={puskes} style={styles.logo} />
          <Image source={idi} style={styles.logo} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    width: 20,
    height: 20,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
