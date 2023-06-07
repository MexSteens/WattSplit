import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView, TextInput, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import LoginRegisterService from './Services/LoginRegisterService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import UserService from './Services/UserService';

const Login = ({ route, navigation }) => {
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {name} = route.params;


    const initialUser = {
        email: "",
        password: ""
    }

    const [user, setUser] = useState(initialUser)

    const login = () => {
        setIsLoading(true);
        const data = {
            email: email,
            password: password
        }
        LoginRegisterService.login(data)
            .then(async response => {
                console.log(response);
                await AsyncStorage.setItem("@jwt", response.data.accessToken);
                setUser(response.data);
                await AsyncStorage.setItem("@userId", response.data.userId + '');
                await AsyncStorage.setItem("@houseId", response.data.houseId + '');
                setIsLoading(false);
                if ((response.data.houseId) >= 0 && (response.data.houseStatus == "ACCEPTED" || response.data.houseStatus == "JOINED")) {
                    navigation.replace("Homescreen")
                } else {
                    navigation.replace('Houses');
                }
            })
            .catch(e => {
                displayErrorMessage(e)
                setIsLoading(false);
                console.log(e);
            });
    }

    const [errorMessage, setErrorMessage] = useState('')

    const displayErrorMessage = (prop) => {
        if (email == '') {
            setErrorMessage("Email is not filled in, please fill in a email")
        }
        else if (password == '') {
            setErrorMessage("Password is not filled in, please fill in a password")
        }
        else if (prop.message = "Request failed with status code 400") {
            setErrorMessage("invalid credentials, please make sure you are using the right username with the corresponding password")
        }
    }

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', authStatus);
            GetFCMToken()
        } else {
            console.log('no permission')
        }
    }

    async function GetFCMToken() {
        let fcmtoken = await AsyncStorage.getItem("fcmtoken");
        console.log(fcmtoken, "old token");
        if (!fcmtoken) {
            try {
                const fcmtoken = await messaging().getToken();
                if (fcmtoken) {
                    console.log(fcmtoken, "new token");
                    await AsyncStorage.setItem("fcmtoken", fcmtoken);
                    saveFCMToken(fcmtoken)
                }
            } catch (error) {
                console.log(error, "error in fcmtoken");
            }
        }
    }

    async function saveFCMToken(token) {
        await UserService.updateFcmToken(await AsyncStorage.getItem("@userId"), token)
        .then(() => {
        })
        .catch(e => {
            console.log(e);
        });
    }

    useEffect(() => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        requestUserPermission()
            // return fcm token for the device
    }, [])

    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <ScrollView>
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
                            <Text style={styles.title}>Login</Text>
                            <Pressable onPress={() => { navigation.navigate('Register') }}>
                                <Text style={styles.subtitle}>
                                    Login to your account here. If you don't have an account, please register by clicking <Text style={{ color: 'rgb(0,223,233)' }}>here</Text>
                                </Text>
                            </Pressable>

                            {/* STEPS */}
                            <View style={styles.steps} id="all-steps">
                                <Pressable onPress={() => { navigation.navigate('FirstScreen') }}>

                                    <View style={styles.step} />
                                </Pressable>
                                <Pressable onPress={() => { navigation.navigate('Register') }}>

                                    <View style={styles.step} />
                                </Pressable>
                                <Pressable onPress={() => { navigation.navigate('Login') }}>

                                    <View style={[styles.step, styles.activeStep]} />
                                </Pressable>
                            </View>
                            {/* END STEPS */}
                            <View style={{ width: '90%' }}>
                                {errorMessage && <View style={styles.errorBox}>
                                    <Text style={styles.text}>
                                        {errorMessage}
                                    </Text>
                                </View>}
                                {name && <View style={styles.confirmBox}>
                                    <Text style={styles.text}>
                                        {name}
                                    </Text>
                                </View>}
                                <Text style={[styles.text, styles.labelinput]}>Email address</Text>
                                <TextInput
                                    style={styles.inputfield}
                                    onChangeText={onChangeEmail}
                                    value={email}
                                    autoCapitalize='none'
                                    placeholder={'john.doe@gmail.com'}
                                />
                                <Text style={[styles.text, styles.labelinput]}>Password</Text>
                                <TextInput
                                    style={styles.inputfield}
                                    onChangeText={onChangePassword}
                                    value={password}
                                    autoCapitalize='none'
                                    placeholder={'*********'}
                                    secureTextEntry={true}
                                />
                                {!isLoading && <Pressable style={styles.button} onPress={() => { login() }
                                }>
                                    <Text style={styles.text}>Login</Text>
                                </Pressable>}
                                {isLoading && <Pressable style={styles.button} disabled={true}>
                                    <ActivityIndicator size={'large'} color={'black'}/>
                                </Pressable>}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

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
        marginTop: 40,
        width: '50%',
        left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        color: 'black',
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 16,
        color: 'black',
        fontSize: 18,
        textAlign: 'center'
    },
    steps: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    step: {
        width: 20,
        height: 20,
        marginHorizontal: 8,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
    },
    activeStep: {
        backgroundColor: 'rgb(0, 223, 223)',
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
        justifyContent: 'center',

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
        marginTop: '-20%',
        height: '35%'
    },
    logo: {
        marginTop: 4,
        marginBottom: 2,
        width: '90%',
    },
    textCenter: {
        alignItems: 'center',
    },
    inputfield: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        fontSize: 20,
        paddingHorizontal: 20
    },
    labelinput: {
        marginTop: 20,
        left: 15,
        marginBottom: 5,
    },
    errorBox: {
        backgroundColor: '#EA1744',
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: -10
    },
    confirmBox: {
        backgroundColor: '#D0E562',
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: -10
    }
});

export default Login;