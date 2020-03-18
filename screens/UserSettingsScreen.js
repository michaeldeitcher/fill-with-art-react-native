import * as React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {UserContext} from '../context/UserContext'
import { showMessage, hideMessage } from "react-native-flash-message"
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

export default function UserSettingsScreen({user, logout}) {
    const onSignout = (context) => {
        context.logout()
        showMessage({
            message: "You have been successfully signed out.",
            type: "success",
        });
    }
    return (
        <UserContext.Consumer>
            {context => (
                <View style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <Text>{context.user.username}</Text>
                    <TouchableHighlight style={[styles.buttonContainer, styles.logoutButton]} onPress={() => onSignout(context)}>
                        <Text style={styles.logoutText}>Sign out</Text>
                    </TouchableHighlight>
                </View>
            )}
        </UserContext.Consumer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
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
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
    },
    logoutButton: {
        backgroundColor: "#00b5ec",
    },
    logoutText: {
        color: 'white',
    }
});
