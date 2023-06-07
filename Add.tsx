import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import PaymentService from './Services/PaymentService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HouseService from './Services/HouseService';


const Add = ({ navigation }) => {
    const [customAmount, setCustomAmount] = useState('');
    const [chosenNumber, setChosenNumber] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [amount, setAmount] = useState('');

    const InitialHouse = {
        id: null,
        name: '',
        city: '',
        userEntities: [],
        paymentEntities: {},
        members: 0,
    }

    const [house, setHouse] = useState(InitialHouse);
    const [modalVisible, setModalVisible] = useState(false);


    async function retrieveHouse() {
        HouseService.get(await AsyncStorage.getItem('@houseId'))
            .then(response => {
                setHouse(response.data)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e);
                // window.location.reload();
            })
    }

    useEffect(() => {
        retrieveHouse()
      }, [])

    function chosen(thechosennumber) {
        setIsSelected(false)
        setCustomAmount('')
        if (chosenNumber == thechosennumber) {
            setChosenNumber('')
        } else {
            setAmount(thechosennumber)
            setChosenNumber(thechosennumber)
        }
    }

    function customNumber(customer) {
        setIsSelected(true)
        setChosenNumber('')
        setCustomAmount(customer)
        setAmount(customer)
    }

    async function addPayment() {
        let userid = await AsyncStorage.getItem("@userId")
        let houseId = await AsyncStorage.getItem("@houseId")
        if (house.userEntities.length !== house.members) {
            setModalVisible(true);
        } else {
            const payment = {
                amount: amount,
                userId: userid,
                houseId: houseId
            }
            PaymentService.create(payment)
                .then(response => {
                    console.log(response.data)
                    navigation.navigate('Homescreen')
                })
                .catch(e => {
                    console.log(e);
                })
        }
    }

    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.cardTitle}>You can only add payments once all the housemates are using the app and are registered in the house. If you need to change the members of your house, go to your settings.</Text>
                        <Pressable
                            style={styles.buttonCloseModal}
                            onPress={() => {setModalVisible(!modalVisible); navigation.navigate('Homescreen')}}>
                            <Text style={styles.text}>Hide Message</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Text style={styles.cardTitle}>Select the amount you have added</Text>
            <View style={styles.rowContainer}>
                <Pressable style={chosenNumber === '5' ? styles.buttonActive : styles.button} onPress={() => chosen('5')}>
                    <Text style={styles.text}>+ 5</Text>
                </Pressable>
                <Pressable style={chosenNumber === '10' ? styles.buttonActive : styles.button} onPress={() => chosen('10')}>
                    <Text style={styles.text}>+ 10</Text>
                </Pressable>
                <Pressable style={chosenNumber === '15' ? styles.buttonActive : styles.button} onPress={() => chosen('15')}>
                    <Text style={styles.text}>+ 15</Text>
                </Pressable>
                <Pressable style={chosenNumber === '20' ? styles.buttonActive : styles.button} onPress={() => chosen('20')}>
                    <Text style={styles.text}>+ 20</Text>
                </Pressable>
            </View>
            <View style={styles.rowContainer}>
                <Pressable style={chosenNumber === '30' ? styles.buttonActive : styles.button} onPress={() => chosen('30')}>
                    <Text style={styles.text}>+ 30</Text>
                </Pressable>
                <Pressable style={chosenNumber === '50' ? styles.buttonActive : styles.button} onPress={() => chosen('50')}>
                    <Text style={styles.text}>+ 50</Text>
                </Pressable>
                <Pressable style={chosenNumber === '100' ? styles.buttonActive : styles.button} onPress={() => chosen('100')}>
                    <Text style={styles.text}>+ 100</Text>
                </Pressable>
                <TextInput
                    style={!isSelected ? styles.inputfield : styles.inputfieldActive}
                    onChangeText={(teest) => customNumber(teest)}
                    value={customAmount}
                    placeholder="Custom"
                    placeholderTextColor="black"
                    keyboardType="numeric"
                />
            </View>
            <Pressable style={styles.buttonRedirect} onPress={() =>
                addPayment()
            }>
                <Text style={styles.text}>Save</Text>
            </Pressable>
            <Pressable style={styles.buttonBack} onPress={() => { navigation.navigate('Homescreen') }
                }>
                    <Text style={styles.text}>Back</Text>
                </Pressable>
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
    cardTitle: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginBottom: 20
    },
    button: {
        marginTop: 40,
        width: '20%',
        // left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)'

    },
    buttonBack: {
        position: 'absolute',
        bottom: 50,
        width: '50%',
        left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    },
    buttonActive: {
        marginTop: 40,
        width: '20%',
        // left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        backgroundColor: 'rgb(0,223,233)',
    },
    buttonRedirect: {
        marginTop: 40,
        width: '50%',
        left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 4,
    },
    inputfield: {
        marginTop: 40,
        width: '20%',
        // left: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        fontSize: 20
    },
    inputfieldActive: {
        marginTop: 40,
        width: '20%',
        // left: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        backgroundColor: 'rgb(0, 223, 223)',
        fontSize: 20
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
})

export default Add;