import React, {useState} from 'react';
import ApiClient from "../constants/ApiClient";
import { showMessage, hideMessage } from "react-native-flash-message"
import {StyleSheet, TouchableHighlight, Text, View, TextInput, AsyncStorage} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

export default function AuthenticationScreen({login}) {
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isSignIn, setIsSignIn] = useState(true)
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = () => {
        setIsPending(true)
        if(isSignIn)
            handleSignin();
        else
            handleSignup();
    }

    const handleSignup = () => {
        fetch(ApiClient.apiRoot + '/users',
            {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    user: {
                        username: username,
                        email: email,
                        password: password
                    }
                })
            })
            .then( (response) => {
                if( response.status === 422 ){
                    handleError(response);
                }
                if( response.status === 201 ){
                    showMessage({
                        message: "Sign up and signed in success!",
                        type: "success",
                    });
                    handleSuccess(response);
                }
            })
            .catch( error => {
                showMessage({
                    message: "Sorry something went wrong.",
                    type: "error",
                });
                console.error("Signup error:" + error);
            })
            .finally(()=>{setIsPending(false)});
    }

    const handleSignin = () => {
        fetch(ApiClient.apiRoot + '/users/sign_in',
            {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    user: {
                        email: email,
                        password: password
                    }
                })
            })
            .then( (response) => {
                if( response.status === 401 ) {
                    showMessage({
                        message: "Signed in failure. Please check your email and password.",
                        type: "error",
                    });
                }
                if( response.status === 201 ) {
                    showMessage({
                        message: "Signed in success!",
                        type: "success",
                    });
                    handleSuccess(response);
                }
            })
            .catch(function (error) {
                showMessage({
                    message: "Sorry something went wrong.",
                    type: "error",
                });
                console.error("Signup error:" + error);
            })
            .finally(()=>{setIsPending(false)});
    }

    const handleSuccess = ( response ) => {
        response.json().then( data => {
            let attr = data.data.attributes;
            AsyncStorage.setItem('auth', JSON.stringify(attr)).then( () => login() )
        });
    }

    const clearErrors = () => {
        setUsernameError('')
        setEmailError('')
        setPasswordError('')
    }

    const handleError = response => {
        response.json().then( data => {
            clearErrors()
            if(data.errors.length) {
                data.errors.forEach( (error) => {
                    if(error.source.pointer === "/data/attributes/username")
                        setUsernameError(error.detail)
                    if(error.source.pointer === "/data/attributes/email")
                        setEmailError(error.detail)
                    if(error.source.pointer === "/data/attributes/password")
                        setPasswordError(error.detail)
                })
            }
        });
    }

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 40
        }}>
            <View style={styles.section}>
                <Text style={Object.assign(isSignIn ? {fontWeight: 'bold'} : {}, {padding: 40})} onPress={() => {clearErrors(); setIsSignIn(true)}}>Sign In</Text>
                <Text style={Object.assign(isSignIn ? {} : {fontWeight: 'bold'}, {padding: 40})} onPress={() => setIsSignIn(false)}>Sign Up</Text>
            </View>
            {!isSignIn &&
                <View>
                    <TextInput style={{height: 40, width: 200}}
                               placeholder="Username"
                               onChangeText={(username) => setUsername(username)}
                               value={username}
                    />
                    <Text style={styles.errorText}>{usernameError}</Text>
                </View>
            }

            <TextInput style={{height: 40, width: 200}}
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
                value={email}
                autoCompleteType='email'
                keyboardType='email-address'
            />
            <Text style={styles.errorText}>{emailError}</Text>

            <TextInput style={{height: 40, width: 200}}
                       placeholder="Password"
                       onChangeText={(password) => setPassword(password)}
                       value={password}
                       secureTextEntry={true}
            />
            <Text style={styles.errorText}>{passwordError}</Text>

            <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => handleSubmit()}>
                <Text style={styles.loginText}>{isPending ? 'Submitting' : 'Submit'}</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    contentContainer: {
        paddingTop: 15,
    },
    optionIconContainer: {
        marginRight: 12,
    },
    option: {
        backgroundColor: '#fdfdfd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
        borderColor: '#ededed',
    },
    lastOption: {
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    optionText: {
        fontSize: 15,
        alignSelf: 'flex-start',
        marginTop: 1,
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20,
        width:250,
        borderRadius:30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    loginText: {
        color: 'white',
    },
    errorText: {
        color: 'red'
    }

});
