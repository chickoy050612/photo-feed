import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { f, auth, database, storage } from './config/config.js';
import * as Facebook from "expo-facebook";

import feed from './app/screens/feed.js';
import profile from './app/screens/profile.js';
import upload from './app/screens/upload.js';
import userProfile from './app/screens/userProfile.js';
import comments from './app/screens/comments.js';
import { Camera } from 'expo-camera';

//initialized facebook
Facebook.initializeAsync('221446215668589','photo-feed');
//import LogAndRegForm from './app/components/logAndReg';


const TabStack = createBottomTabNavigator (
  {
    //Home: { screen: LogAndRegForm },
    Feed: { screen: feed },
    Upload: { screen: upload },
    Profile: { screen: profile }
  }
)

const MainStack = createStackNavigator (
  {
    Home: { screen: TabStack },
    User: { screen: userProfile },
    Comments: { screen: comments }
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none',
  }
)

export default class App extends React.Component {


  constructor(props){
    super(props);
   
  }
  render() {
    return (
      <MainStack />
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
