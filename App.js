import React, {useState, useEffect} from 'react'
import ApiClient from './constants/ApiClient'
import axios from 'axios'
import FlashMessage from "react-native-flash-message";
import AuthenticationScreen from "./screens/AuthenticationScreen";
import { AsyncStorage } from 'react-native'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { SplashScreen } from 'expo'
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import BottomTabNavigator from './navigation/BottomTabNavigator'
import useLinking from './navigation/useLinking'
import {UserContext} from "./context/UserContext";

const Stack = createStackNavigator()

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const [user,setUser] = useState(null)
  const [anonymousToken, setAnonymousToken] = useState("")
  const [initialNavigationState, setInitialNavigationState] = useState()
  const containerRef = React.useRef()
  const { getInitialState } = useLinking(containerRef)

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
        loadAnonymousToken()
        login()
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  const loadAnonymousToken = () => {
    AsyncStorage.getItem('anonymousToken').then((anonymousToken) => {
      if (!anonymousToken) {
        axios.post(ApiClient.apiRoot + '/anonymous_tokens').then((response) => {
          if (response.status === 201) {
            anonymousToken = response.data.token;
            AsyncStorage.setItem('anonymousToken', anonymousToken)
          }
        })
            .catch(function (error) {
              console.log("error: " + error);
            })
      }

      setAnonymousToken(anonymousToken);
    })
  }

  const login = () => {
    AsyncStorage.getItem('auth').then((auth) => {
      let user = auth ? JSON.parse(auth) : null
      setUser(user)
    })
  }

  const logout = () => {
    AsyncStorage.removeItem('auth')
    setUser(null)
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <UserContext.Provider value={{
          user: user,
          anonymousToken: anonymousToken,
          login: login,
          logout: logout
        }}>
        {user &&
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator}/>
          </Stack.Navigator>
        </NavigationContainer>
        }
        {!user &&
            <AuthenticationScreen login={() => login()}/>
        }
        </UserContext.Provider>
        <FlashMessage position="top" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
