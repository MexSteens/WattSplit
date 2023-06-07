import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckCircle, faGear, faHouseChimneyMedical, faHouseChimneyUser, faInfoCircle, faTimesCircle, faUser } from '@fortawesome/free-solid-svg-icons';

const Houses = ({ route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const { kicked, notaccepted } = route.params

    useEffect(() => {
        console.log(notaccepted)
        if (kicked) {
            setModalVisible(true)
            console.log('kicked')
        }
        if (notaccepted) {
            setModalVisible(true)
        }
    }, [])
    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <View style={styles.row}>
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {notaccepted && <Text style={styles.cardTitle}>You have not been accepted to the house you applied for. Please try a different house or communicate with your housemembers and try again.</Text>}
                        {kicked && <Text style={styles.cardTitle}>You have been kicked from the house you were in. Please try a different house or communicate with your housemembers and try again.</Text>}
                        <Pressable
                            style={styles.buttonCloseModal}
                            onPress={() => {setModalVisible(!modalVisible);}}>
                            <Text style={styles.text}>Hide Message</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
                <View style={styles.col}>
                    {/* <View style={styles.loginHead}>
                        <Image
                            style={styles.logo}
                            source={require('./logo.png')}
                        />
                    </View> */}
                    <View style={styles.textCenter}>
                        <Text style={styles.title}>Create or join</Text>
                        <Text style={styles.subtitle}>
                            Do you want to create a new house to split electricity costs with or do you want to join an existing house?
                        </Text>
                    </View>

                    <View>
                        <TouchableOpacity onPress={() => { navigation.navigate('HouseCreate') }}>
                            <View style={styles.beginCard}>
                                <View style={styles.row}>
                                    <View>
                                        <FontAwesomeIcon
                                            icon={faHouseChimneyMedical}
                                            color='rgb(0, 223, 223)'
                                            size={38}
                                            // style={[styles.beginCardIcon, styles.plastyGreen]}
                                        />
                                        </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.beginCardText}>
                                            I want to create a house
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { navigation.navigate('HouseSearch') }}>
                            <View style={styles.beginCard}>
                                <View style={styles.row}>
                                    <View>
                                        <FontAwesomeIcon
                                            icon={faHouseChimneyUser}
                                            color='rgb(0,223,223)'
                                            size={38}
                                            // style={[styles.beginCardIcon, styles.plastyRed]}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.beginCardText}>
                                            I want to join a house
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
    buttonCloseModal: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
        marginTop: 4,
    },
    logo: {
        marginTop: 4,
        marginBottom: 2,
        width: '80%',
    },
    textCenter: {
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        color: 'black',
    },
    cardTitle: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginBottom: 14,
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

export default Houses;