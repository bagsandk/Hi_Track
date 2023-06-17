import React, {useEffect} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import hiv from '../assets/img/hiv.png';
import malahayati from '../assets/img/malahayati.png';
import puskes from '../assets/img/puskes.png';
import idi from '../assets/img/idi.png';

export default function Splash({navigation}) {
  useEffect(() => {
    // Simulasi penundaan selama 2 detik
    setTimeout(() => {
      navigation.replace('Profil');
    }, 2000);
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.hitrack}>{`Hi-Track`}</Text>
      <Image
        source={hiv}
        style={{
          width: 227,
          height: 240,
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      />
      <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
        <Image source={malahayati} style={styles.logo} />
        <Image source={puskes} style={styles.logo} />
        <Image source={idi} style={styles.logo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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

