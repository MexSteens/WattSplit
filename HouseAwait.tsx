import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckCircle, faGear, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import UserService from './Services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';


function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

const HouseAwait = ({ navigation }) => {

    async function userRetrieve() {
        console.log(await AsyncStorage.getItem('@houseId'))
        UserService.get(await AsyncStorage.getItem('@userId'))
        .then(response => {
            // clearInterval(intervalId)
            console.log(response.data)
            if (response.data.statusEnum == 'NOT_ACCEPTED') {
                navigation.replace('Houses', {kicked: false, notaccepted: true})
            }
            if (response.data.statusEnum == 'ACCEPTED') {
                navigation.replace('Homescreen')
            }
        })
        .catch(e => {
            console.log(e)
        })
    }

    useInterval(() => {
        userRetrieve()
    }, 10000)
    
    // useEffect(() => {
    //     const id = setInterval(userRetrieve, 10000)
    // })

    async function rechoose() {
        UserService.updateHouseStatus(await AsyncStorage.getItem('@userId'), "NOT_APPLIED")
        .then(response => {
            console.log(response.data)
            navigation.replace('Houses')
        })
        .catch(e => {
            console.log(e);
            // window.location.reload();
        })
    }

    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            {/* <View style={{ width: '100%', alignItems: 'center' }}> */}
            <View style={styles.row}>
                <View style={styles.col}>
                    <View style={styles.loginHead}>
                    <Image
                            style={styles.logo}
                            source={require('./logo_wattsplit_full_edited-removebg-preview.png')}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={styles.textCenter}>
                        <Text style={styles.title}>You have requested to join the house</Text>
                        <Text style={styles.subtitle}>
                            Someone in the house will now need to accept your request to join. Once you have been accepted you will automatically be redirected to the homepage of the house.</Text>
                            <View style={{backgroundColor: 'black', borderRadius: 120}}>
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            color='#D0E562'
                                            size={120}
                                            // style={[styles.beginCardIcon, styles.plastyGreen]}
                                        />
                                    </View>
                            <Text style={styles.subtitle2}>Press the button below to rechoose a house if something went wrong.</Text>
                            <Pressable style={styles.button} onPress={() =>{rechoose()}
                            }>
                                <Text style={styles.text}>Rechoose</Text>
                            </Pressable>
                        </View>
                        </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundWhite: {
        backgroundColor: 'rgb(255,255,255)',
        height: Dimensions.get('window').height
    },
    text: {
        color: 'black',
        fontSize: 20,
    },
    button: {
        marginTop: 4,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4,
    },
    col: {
        margin: 0,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 360,
    },
    loginHead: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '-28%',
        height: '25%'
    },
    logo: {
        marginTop: 4,
        marginBottom: 2,
        width: '90%',
    },
    textCenter: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        color: 'black',
        textAlign: 'center'
    },
    subtitle: {
        marginTop: 8,
        marginBottom: '30%',
        color: 'black',
        fontSize: 18,
        textAlign: 'center'
    },
    subtitle2: {
        marginTop: '30%',
        marginBottom: 16,
        color: 'black',
        fontSize: 18,
        textAlign: 'center'
    },
});

export default HouseAwait;