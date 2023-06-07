import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView, TextInput, Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { useHeaderHeight } from '@react-navigation/elements'
import LoginRegisterService from './Services/LoginRegisterService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Register = ({ navigation }) => {
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [name, onChangeName] = useState('');

    const initialUserState = {
        name: "",
        email: "",
        password: "",
    }

    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(initialUserState);

    async function saveUser() {
        var data = {
            name: name,
            email: email,
            password: password,
        };

        await LoginRegisterService.create(data)
        .then(async response => {
            setUser(response.data);
            await AsyncStorage.setItem("@userId", response.data.id)
            navigation.navigate('Login',{ name:'Your account is succesfully created! Please login to continue to the app'})
            // debugger;
        })
        .catch(e => {
            console.log(e);
            // debugger;
            console.log('hey')
            setErrorMessage(e.response.data[0].defaultMessage.split(','));
            console.log(errorMessage[0]);
        });
    }

    const submitForm = () => {
        setErrorMessage('');
        if (name == "" || email == "" || password == "") {
            setErrorMessage("Not all fields are filled in");
        }
        else {
            saveUser();
        }
    }

    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <KeyboardAvoidingView keyboardVerticalOffset={useHeaderHeight() + 350}
      behavior="padding"
      style={{ flex: 1 }}
      enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                        <Text style={styles.title}>Register</Text>
                        <Pressable onPress={() => { navigation.navigate('Login') }}>
                            <Text style={styles.subtitle}>
                                Register your account here. If you already have an account, please login <Text style={{ color: 'rgb(0,223,233)' }}>here</Text>
                            </Text>
                        </Pressable>

                        {/* STEPS */}
                        <View style={styles.steps} id="all-steps">
                            <Pressable onPress={() => { navigation.navigate('FirstScreen') }}>
                                <View style={styles.step} />
                            </Pressable>
                            <Pressable onPress={() => { navigation.navigate('Register') }}>

                                <View style={[styles.step, styles.activeStep]} />
                            </Pressable>
                            <Pressable onPress={() => { navigation.navigate('Login') }}>

                                <View style={styles.step} />
                            </Pressable>
                        </View>
                        {/* END STEPS */}

                        <View style={{ width: '90%' }}>
                        {errorMessage && <View style={styles.errorBox}>
                                <Text style={styles.text}>
                                    {errorMessage}
                                </Text>
                            </View>}
                            <Text style={[styles.text, styles.labelinput]}>Full name</Text>
                            <TextInput
                                style={styles.inputfield}
                                onChangeText={onChangeName}
                                value={name}
                                placeholder={'John Doe'}
                            />
                            <Text style={[styles.text, styles.labelinput]}>Email address</Text>
                            <TextInput
                                style={styles.inputfield}
                                onChangeText={onChangeEmail}
                                value={email}
                                placeholder={'john.doe@gmail.com'}
                                autoCapitalize='none'
                            />
                            <Text style={[styles.text, styles.labelinput]}>Password</Text>
                            <TextInput
                                style={styles.inputfield}
                                onChangeText={onChangePassword}
                                value={password}
                                placeholder={'*********'}
                                secureTextEntry={true}
                                autoCapitalize='none'
                            />
                            <Pressable style={styles.button} onPress={() =>{submitForm()}
                            }>
                                <Text style={styles.text}>Register</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

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
        marginTop: '-20%',
        height: '30%'
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
    }
});

export default Register;