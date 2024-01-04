import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeNavigator from './HomeNavigator';
import SearchScreen from '../screens/home/SearchScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeNavigator">
      <Stack.Screen
        name="HomeNavigator"
        component={HomeNavigator}
      />
      {/* <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
      /> */}
    </Stack.Navigator>
  );
};

export default HomeStack;
