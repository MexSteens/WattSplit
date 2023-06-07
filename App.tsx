/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {PropsWithChildren, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Homescreen from './home';
import Calender from './Calender';
import Add from './Add';
import FirstScreen from './FirstScreen';
import Login from './Login';
import Register from './Register';
import Houses from './Houses';
import HouseSearch from './HouseSearch';
import HouseCreate from './HouseCreate';
import HouseAwait from './HouseAwait';
import Settings from './Settings';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';


const Stack = createNativeStackNavigator();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent('app', () => App);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer >
      <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={"Login"}>
        <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="Login" component={Login} initialParams={{ name: false }}/>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Houses" component={Houses} initialParams={{ kicked: false, notaccepted: false }}/>
        <Stack.Screen name="HouseSearch" component={HouseSearch} />
        <Stack.Screen name="HouseCreate" component={HouseCreate} />
        <Stack.Screen name="HouseAwait" component={HouseAwait} />
        <Stack.Screen
          name="Homescreen"
          component={Homescreen}
        />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Calender" component={Calender} />
        <Stack.Screen name="Add" component={Add} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
