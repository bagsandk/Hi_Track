import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import hiv from '../assets/img/hiv.png';
import RoundedTextInput from '../components/RoundedTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

type ProfilType = {
  age: string;
  name: string;
};

export default function Profil({navigation}) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const handleAgeChange = (value: string) => {
    setAge(value);
  };

  const renderAgeOptions = () => {
    const ageOptions = [];
    for (let age = 15; age <= 70; age++) {
      ageOptions.push(
        <Picker.Item
          key={age.toString()}
          label={age.toString()}
          value={age.toString()}
        />,
      );
    }
    return ageOptions;
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
          marginTop: 30,
        }}>
        <Text style={{fontSize: 24, color: '#000', fontWeight: '600'}}>
          Profil
        </Text>
        <Image source={hiv} style={{width: 30, height: 30}} />
      </View>
      <View style={{flex: 1, justifyContent: 'center', width: '100%'}}>
        <View style={{marginBottom: 10}}>
          <Text style={{marginBottom: 2, color: '#000'}}>Nama</Text>
          <RoundedTextInput
            placeholder="Masukkan Nama"
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <Text style={{marginBottom: 2, color: '#000'}}>Umur</Text>
          <TouchableOpacity onPress={toggleModal}>
            <RoundedTextInput
              onFocus={toggleModal}
              // onBlur={toggleModal}
              editable={false}
              pointerEvents="none"
              placeholder="Masukkan Umur 14 - 70 tahun"
              value={age}
              keyboardType="numeric"
              // onChangeText={text => setAge(text)}
            />
          </TouchableOpacity>
        </View>

        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Selesai</Text>
            </TouchableOpacity>
            <View style={{backgroundColor: '#fff', paddingVertical: 10}}>
              <Picker
                selectedValue={age}
                style={{color: '#000'}}
                onValueChange={handleAgeChange}>
                {renderAgeOptions()}
              </Picker>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{alignSelf: 'flex-end'}}>
        <TouchableOpacity
          disabled={age == '' || name == ''}
          style={{
            marginBottom: 40,
            borderRadius: 10,
            borderWidth: 2,
            padding: 10,
            width: 150,
          }}
          onPress={handleSchedule}>
          <Text style={{textAlign: 'center', fontSize: 16, color: '#000'}}>
            Selanjutnya
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
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeButton: {
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    backgroundColor: 'white',
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
  },
});
