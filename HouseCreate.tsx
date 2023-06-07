import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import HouseService from './Services/HouseService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HouseCreate = ({ navigation }) => {
    const [houseName, onChangeHouseName] = useState('')
    const [city, onChangeCity] = useState('')
    const [averageUsage, setAverageUsage] = useState('')
    const [members, setMembers] = useState('')

    async function Create() {
        const house = {
            name: houseName,
            city: city,
            members: members,
            avgUsage: averageUsage
        }
        HouseService.create(await AsyncStorage.getItem('@userId'), house)
        .then(response => {
            console.log(response.data)
            navigation.navigate('Homescreen')
        })
        .catch(e => {
            console.log(e);
            // window.location.reload();
        })
    }

    const [errorMessageMembers, setErrorMessageMembers] = useState('')
    const [errorMessageWeekly, setErrorMessageWeekly] = useState('')

    function onlyAllowNumbers(text, members){
        let newText = '';
        let numbers = '0123456789';
        setErrorMessageMembers('')
        setErrorMessageWeekly('')
      
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                if (members) {
                    setErrorMessageMembers("please enter numbers only");
                } else {
                    setErrorMessageWeekly("please enter numbers only");
                }
            }
        }
        if (members){
            setMembers( newText );
        } else {
            setAverageUsage(newText);
        }
    }
    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <View style={styles.textCenter}>
                <Text style={styles.title}>Create a house</Text>
            </View>
            <View style={{ width: '90%', height: Dimensions.get('window').height * 0.9 }}>
                <Text style={[styles.text, styles.labelinput]}>House name</Text>
                <TextInput
                    style={styles.inputfield}
                    onChangeText={onChangeHouseName}
                    value={houseName}
                    placeholder={'The Best House Ever'}
                />
                <Text style={[styles.text, styles.labelinput]}>City name</Text>
                <TextInput
                    style={styles.inputfield}
                    onChangeText={onChangeCity}
                    value={city}
                    placeholder={'Waterford'}
                />
                {errorMessageWeekly && <View style={styles.errorBox}>
                                    <Text style={styles.text}>
                                        {errorMessageWeekly}
                                    </Text>
                                </View>}
                <Text style={[styles.text, styles.labelinput]}>Average weekly usage amount</Text>
                <TextInput
                    style={styles.inputfield}
                    onChangeText={(text)=> onlyAllowNumbers(text, false)}
                    value={averageUsage}
                    keyboardType="numeric"
                    placeholder={'70'}
                    maxLength={3}
                />
                {errorMessageMembers && <View style={styles.errorBox}>
                                    <Text style={styles.text}>
                                        {errorMessageMembers}
                                    </Text>
                                </View>}
                <Text style={[styles.text, styles.labelinput]}>Amount of housemates</Text>
                <TextInput
                    style={styles.inputfield}
                    onChangeText={(text)=> onlyAllowNumbers(text, true)}
                    value={members}
                    keyboardType="numeric"
                    placeholder={'4'}
                    maxLength={2}
                />
                <Pressable style={styles.button} onPress={() => { Create() }
                }>
                    <Text style={styles.text}>Create house</Text>
                </Pressable>

                <Pressable style={styles.buttonBack} onPress={() => { navigation.navigate('Houses') }
                }>
                    <Text style={styles.text}>Back</Text>
                </Pressable>
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
        left: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    },
    buttonBack: {
        position: 'absolute',
        bottom: 20,
        width: '50%',
        left: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
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
    textCenter: {
        alignItems: 'center',
    },
    inputfield: {
        width: '100%',
        // alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        fontSize: 20,
        paddingHorizontal: 20,
        left: '5%'
    },
    labelinput: {
        marginTop: 20,
        left: '10%',
        marginBottom: 5,
    },
    errorBox: {
        backgroundColor: '#EA1744',
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        left: '5%',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: -10
    },
});

export default HouseCreate;