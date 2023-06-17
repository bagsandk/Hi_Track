import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import hiv from '../assets/img/hiv.png';
import RoundedTextInput from '../components/RoundedTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfilType = {
  age: string;
  name: string;
};

export default function Profil({navigation}) {
  const [age, setAge] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const defaultValue = await AsyncStorage.getItem('profile');
      if (defaultValue !== null) {
        const profileValue: ProfilType = JSON.parse(defaultValue);
        const agee = profileValue.age;
        const namee = profileValue.name;
        setAge(agee);
        setName(namee);
      }
    } catch (error) {
      console.log('Error loading default value:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const profileValue = JSON.stringify({age: age, name: name});
      await AsyncStorage.setItem('profile', profileValue);
    } catch (error) {
      console.log('Error loading default value:', error);
    }
  };

  const handleSchedule = async () => {
    saveProfile().then(() => {
      navigation.navigate('Schedule');
    });
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
        <Text style={{fontSize: 24, fontWeight: '600'}}>Profil</Text>
        <Image source={hiv} style={{width: 30, height: 30}} />
      </View>
      <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
        <View style={{marginBottom: 10}}>
          <Text style={{marginBottom: 2}}>Nama</Text>
          <RoundedTextInput
            placeholder="Masukkan Nama"
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <Text style={{marginBottom: 2}}>Umur</Text>
          <RoundedTextInput
            placeholder="Masukkan Umur 14 - 70 tahun"
            value={age}
            keyboardType="numeric"
            onChangeText={text => setAge(text)}
          />
        </View>
      </View>
      <View style={{alignSelf: 'flex-end'}}>
        <TouchableOpacity
          disabled={age == '' || name == ''}
          style={{
            borderRadius: 10,
            borderWidth: 2,
            padding: 10,
            width: 150,
          }}
          onPress={handleSchedule}>
          <Text style={{textAlign: 'center', fontSize: 16}}>Selanjutnya</Text>
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
