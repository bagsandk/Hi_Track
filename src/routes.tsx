import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Profile from './screens/Profile';
import Schedule from './screens/Schedule';
import Home from './screens/Home';
import CalendarScreen from './screens/Calendar';
import {navigationRef} from '../src/components/RootNavigation';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Profil" component={Profile} options={{headerShown: false}} />
        <Stack.Screen name="Schedule" options={{headerShown: false}} component={Schedule} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
