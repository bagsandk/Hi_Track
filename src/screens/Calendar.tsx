import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import hiv from '../assets/img/hiv.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<{}>;

export default function CalendarScreen({route, navigation}: Props) {
  const [info, setInfo] = useState(null);
  const [age, setAge] = useState(null);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const {day} = route.params;

  const getHari = (dateString: string) => {
    var days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
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
    return `${days[d.getDay()]} , ${d.getDate()} ${
      mount[d.getMonth()]
    } ${d.getFullYear()}`;
  };

  const loadStorage = async () => {
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
        const time = scheduleValue ? scheduleValue.time : '';
        setTime(time);
      }
      if (defaultValue !== null) {
        const scheduleMark = defaultValue ? JSON.parse(defaultValue) : {};
        if (scheduleMark.hasOwnProperty(day)) {
          setInfo(scheduleMark[day]);
        }
      }
    } catch (error) {
      console.log('Error loading default value:', error);
    }
  };

  const saveSchedule = async () => {
    try {
      const oldScheduleMark = await AsyncStorage.getItem('scheduleMark');

      const old = oldScheduleMark ? JSON.parse(oldScheduleMark) : null;
      const updateScheduleMark = {...old};

      if (updateScheduleMark.hasOwnProperty(day)) {
        updateScheduleMark[day] = {
          marked: true,
          selected: true,
          selectedColor: '#86CA85',
        };
      }
      const scheduleMark = JSON.stringify(updateScheduleMark);
      await AsyncStorage.setItem('scheduleMark', scheduleMark);
    } catch (error) {
      console.log('Error loading default value:', error);
    }
  };

  const handleSchedule = () => {
    saveSchedule().then(() => {
      navigation.navigate('Home');
    });
  };
  useEffect(() => {
    loadStorage();
  }, []);
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
        <Text style={{fontSize: 24, fontWeight: '600'}}>
          {info ? 'Jadwal Minum Obat' : 'Tidak Ada Jadwal'}
        </Text>
        <Image source={hiv} style={{width: 30, height: 30}} />
      </View>
      <View style={{flex: 1}}>
        <View style={{marginTop: 5}}>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
              marginBottom: 5,
              fontWeight: '500',
            }}>
            {name ? `${name} (${age})` : '-'}
          </Text>
          <Text style={{color: '#000'}}>{getHari(day)}</Text>
          <Text style={{color: '#000'}}>
            {info ? (time ? time : '_') : '-'}
          </Text>
        </View>
      </View>
      <View style={{alignSelf: 'center'}}>
        {info && info.marked && info.selected == false && (
          <TouchableOpacity
            style={{
              padding: 10,
              width: 150,
            }}
            onPress={handleSchedule}>
            <Text style={{textAlign: 'center', fontSize: 16, color: '#ed3f36'}}>
              Selesai
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    width: 40,
    height: 40,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
