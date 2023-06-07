import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckCircle, faGear, faInfoCircle, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons';

const FirstScreen = ({ navigation }) => {
    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
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
                        <Text style={styles.title}>Login or register</Text>
                        <Text style={styles.subtitle}>
                            Welcome to Electric Uni! To continue on your journey, please login or register.
                        </Text>

                        {/* STEPS */}
                        <View style={styles.steps} id="all-steps">
                        <Pressable onPress={() => { navigation.navigate('FirstScreen') }}>

                            <View style={[styles.step, styles.activeStep]} />
                            </Pressable>
                            <Pressable onPress={() => { navigation.navigate('Register') }}>

                            <View style={styles.step} />
                            </Pressable>
                            <Pressable onPress={() => { navigation.navigate('Login') }}>

                            <View style={styles.step} />
                            </Pressable>
                        </View>
                        {/* END STEPS */}
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
                            <View style={styles.beginCard}>
                                <View style={styles.row}>
                                    <View style={{backgroundColor: 'black', borderRadius: 25}}>
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            color='#D0E562'
                                            size={38}
                                            // style={[styles.beginCardIcon, styles.plastyGreen]}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.beginCardText}>
                                            I already have an account
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                            <View style={styles.beginCard}>
                                <View style={styles.row}>
                                    <View style={{backgroundColor: 'black', borderRadius: 25}}>
                                        <FontAwesomeIcon
                                            icon={faTimesCircle}
                                            color='#EA1744'
                                            size={38}
                                            // style={[styles.beginCardIcon, styles.plastyRed]}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.beginCardText}>
                                            I don't have an account
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
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
        marginTop: 40,
        width: '50%',
        left: '25%',
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
        height: '42%'
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
    beginCard: {
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        borderRadius: 4,
        marginTop: 16,
        padding: 16,
        backgroundColor: '#FCFCFC'
    },
    beginCardText: {
        fontSize: 20,
        marginLeft: 20,
        color: 'black',
        fontWeight: 'bold',
        top: 3
    },
    beginCardIcon: {
        fontSize: 40,
    },
    plastyGreen: {
        color: 'green',
    },
    plastyRed: {
        color: 'red',
    },
    textDecoration: {
        color: 'black'
    }
});

export default FirstScreen;