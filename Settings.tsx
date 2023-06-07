import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowDown, faArrowRight, faGear, faInfoCircle, faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from './Services/UserService';
import HouseService from './Services/HouseService';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';

const RecentlyPayed = ({ user1}) => {
    const [kicked, setKicked] = useState(false)

    const avatar = createAvatar(bottts, {
        seed: user1.name
    }).toString();

    async function kickUser(user2) {
        await UserService.updateHouseStatus(user2.id, 'NOT_ACCEPTED')
            .then(response => {
                console.log(response.data)
                setKicked(true)
            })
            .catch(e => {
                console.log(e);
            })
    }

    return (<View>
        {!kicked && <View><View style={styles.divider} />
            <View style={styles.rowContainer}>
                <View style={styles.profilePicHouseMemberView}>
                    {/* <Image
                style={styles.profilePicHouseMember}
                source={{ uri: 'http://i.imgur.com/QSev0hg.jpg' }}
            /> */}
                    <SvgXml xml={avatar} style={styles.profilePicHouseMember} />
                </View>
                <Text style={styles.nameText}>{user1.name}</Text>
                <Pressable style={styles.buttonRedHouseMember} onPress={() => { kickUser(user1) }}>
                    <Text style={styles.text}>Kick</Text>
                </Pressable>
            </View></View>}
    </View>
    )

}


const Settings = ({ navigation }) => {
    const [manageHouse, setManageHouse] = useState(false)
    const [changeMembers, setChangeMembers] = useState(false)
    const [logoutClicked, setLogoutClicked] = useState(false)
    const [leaveHouseClicked, setLeaveHouseClicked] = useState(false)
    const [changeName, setChangeName] = useState(false)
    const [name, setName] = useState('')
    const [users, setUsers] = useState([])
    const [members, setMembers] = useState('')
    const InitialUser = {
        id: null,
        name: '',
        members: '',
    }
    const [user, setUser] = useState(InitialUser)

    const InitialHouse = {
        id: null,
        name: '',
        city: '',
        userEntities: [],
        paymentEntities: {},
    }


    const [house, setHouse] = useState(InitialHouse);

    async function retrieveHouse() {
        HouseService.get(await AsyncStorage.getItem('@houseId'))
            .then(response => {
                setHouse(response.data)
                setUsers(response.data.userEntities)
                setMembers(response.data.members + '')
                console.log(response.data)
            })
            .catch(e => {
                console.log(e);
            })
    }

    const [errorMessageMembers, setErrorMessageMembers] = useState('')

    function onlyAllowNumbers(text){
        let newText = '';
        let numbers = '0123456789';
        setErrorMessageMembers('')
      
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                    setErrorMessageMembers("please enter numbers only");
            }
        }

            setMembers( newText );


    }


    async function updateHouseMembers(amount) {
        HouseService.updatemembers(await AsyncStorage.getItem('@houseId'), amount)
            .then(response => {
                setHouse(response.data)
                // setUsers(response.data.userEntities)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e);
            })
    }

    async function retrieveUser() {
        UserService.get(await AsyncStorage.getItem('@userId'))
            .then(response => {
                setUser(response.data)
                setName(response.data.name)
            })
            .catch(e => {
                console.log(e);
            })
    }

    const avatar = createAvatar(bottts, {
        seed: name
    }).toString();

    useEffect(() => {
        retrieveHouse()
        retrieveUser()
    }, [])

    async function logout() {
        await AsyncStorage.clear();
        navigation.replace('FirstScreen');
    }

    async function leaveHouse() {
        await UserService.updateHouseStatus(await AsyncStorage.getItem('@userId'), 'NOT_APPLIED')
            .then(response => {
                AsyncStorage.setItem('@houseId', '');
                console.log(response.data)
                navigation.replace('Houses')
            })
            .catch(e => {
                console.log(e);
                // window.location.reload();
            })
    }



    return (
        <ScrollView style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <View style={styles.body}>
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* <Image
                            style={styles.profilePic}
                            source={{ uri: 'http://i.imgur.com/QSev0hg.jpg' }}
                        /> */}
                        <View style={styles.profilePicView}><SvgXml xml={avatar} style={styles.profilePic} /></View>
                        {!changeName && <Pressable style={{ flexDirection: 'row' }} onPress={() => { setChangeName(!changeName) }}><Text style={styles.subtitle}>{name} <FontAwesomeIcon icon={faPencil} /></Text></Pressable>}
                        {changeName && <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <TextInput
                                style={styles.inputfield}
                                onChangeText={setName}
                                value={name}
                                placeholder={'(lorem ipsum)'}
                            />
                            <Pressable style={styles.button} onPress={() => { setChangeName(!changeName) }}>
                                <Text style={styles.text}>save</Text>
                            </Pressable>
                            <Pressable style={styles.buttonRed} onPress={() => { setChangeName(!changeName); setName(user.name) }}>
                                <Text style={styles.text}>cancel</Text>
                            </Pressable>
                        </View>}
                    </View>
                    <View style={styles.cardInBetween}>
                        <Text style={styles.text}>House settings</Text>
                    </View>
                    <View style={styles.settingCard}>
                        <Pressable style={styles.settingContainer} onPress={() => { setManageHouse(!manageHouse) }}>
                            <View style={styles.rowContainer} >
                                <Text style={styles.text}>
                                    Manage housemates
                                </Text>
                                {!manageHouse && <FontAwesomeIcon icon={faArrowRight} />}
                                {manageHouse && <FontAwesomeIcon icon={faArrowDown} />}
                            </View>
                            {manageHouse && users && users.map((usermap, i) => { return (<RecentlyPayed user1={usermap} />) })}
                        </Pressable>
                        <Pressable style={styles.settingContainer} onPress={() => { setLeaveHouseClicked(!leaveHouseClicked) }}>
                            <View style={styles.rowContainer} >
                                <Text style={styles.text}>
                                    Leave house
                                </Text>
                                {!leaveHouseClicked && <FontAwesomeIcon icon={faArrowRight} />}
                                {leaveHouseClicked && <FontAwesomeIcon icon={faArrowDown} />}
                            </View>
                            {leaveHouseClicked && <View >
                                <Pressable style={styles.denyButton} onPress={() => { leaveHouse() }}>
                                    <Text style={styles.text}>Leave</Text>
                                </Pressable>
                            </View>}
                        </Pressable>
                        <Pressable style={styles.settingContainer} onPress={() => { setChangeMembers(!changeMembers) }}>
                            <View style={styles.rowContainer} >
                                <Text style={styles.text}>
                                    Change members
                                </Text>
                                {!changeMembers && <FontAwesomeIcon icon={faArrowRight} />}
                                {changeMembers && <FontAwesomeIcon icon={faArrowDown} />}
                            </View>
                            {changeMembers && <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <TextInput
                                style={styles.inputfieldMembers}
                                onChangeText={(text)=> onlyAllowNumbers(text)}
                                value={members}
                                placeholder={'5'}
                                keyboardType='numeric'
                                maxLength={2}
                            />
                            <Pressable style={styles.buttonMembers} onPress={() => { setChangeMembers(!changeMembers); updateHouseMembers(members) }}>
                                <Text style={styles.text}>save</Text>
                            </Pressable> 
                            </View>}
                        </Pressable>
                        
                    </View>
                    <View style={styles.cardInBetween2}>
                        <Text style={styles.text}>Profile</Text>
                    </View>
                    <View style={styles.settingCard2}>
                        <Pressable style={styles.settingContainer} onPress={() => { setLogoutClicked(!logoutClicked) }}>
                            <View style={styles.rowContainer} >
                                <Text style={styles.text}>
                                    Logout
                                </Text>
                                {!logoutClicked && <FontAwesomeIcon icon={faArrowRight} />}
                                {logoutClicked && <FontAwesomeIcon icon={faArrowDown} />}
                            </View>
                            {logoutClicked && <View >
                                <Pressable style={styles.denyButton} onPress={() => { logout() }}>
                                    <Text style={styles.text}>Logout</Text>
                                </Pressable>
                            </View>}
                        </Pressable>
                    </View>
                    <Pressable style={styles.buttonBack} onPress={() => { navigation.navigate('Homescreen') }}>
                        <Text style={styles.text}>Back</Text>
                    </Pressable>
                </View>

            </View>
            {/* <View style={{alignItems: 'center'}}>
                <Image
                    style={styles.profilePic}
                    source={{ uri: 'http://i.imgur.com/QSev0hg.jpg' }}
                />
                <Text style={styles.subtitle}>(lorem ipsum)</Text>
            </View> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    backgroundWhite: {
        backgroundColor: 'rgb(255,255,255)',
        height: Dimensions.get('window').height
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // width: '100%',
        paddingVertical: 10,

    },
    text: {
        color: 'black',
        fontSize: 20,
    },
    subtitle: {
        marginTop: 12,
        marginBottom: 16,
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    button: {
        // marginTop: 40,
        // width: '50%',
        // left: '25%',
        width: '19%',
        left: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: 8,
        borderRadius: 10,
        // elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
        marginBottom: 15,
    },
    buttonMembers: {
        // marginTop: 40,
        // width: '50%',
        // left: '25%',
        width: '19%',
        left: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: 8,
        borderRadius: 10,
        // elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
        marginBottom: 15,
    },
    buttonBack: {
        width: '50%',
        // left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
        marginBottom: 10,
    },
    buttonRed: {
        // marginTop: 40,
        // width: '50%',
        // left: '25%',
        width: '19%',
        left: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: 8,
        borderRadius: 10,
        // elevation: 3,
        backgroundColor: '#EA1744',
        marginBottom: 15,
    },
    profilePic: {
        width: Dimensions.get('window').width * 0.35,
        height: Dimensions.get('window').width * 0.35,
        // borderRadius: Dimensions.get('window').width * 0.35,
        // borderWidth: 2,
        // borderColor: 'black',
        // backgroundColor: '#7c94b6',
        // marginTop: 20,
        // alignContent: 'center'
    },
    profilePicView: {
        borderRadius: 100,
        borderWidth: 4,
        borderColor: 'rgb(0,223,223)',
        backgroundColor: 'white',
    },
    profilePicHouseMember: {
        width: Dimensions.get('window').width * 0.18,
        height: Dimensions.get('window').width * 0.18,
        borderRadius: Dimensions.get('window').width * 0.1,
        // borderWidth: 2,
        // borderColor: 'black',
        // backgroundColor: '#7c94b6',
        // marginTop: 20,
        // alignContent: 'center'
    },
    profilePicHouseMemberView: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'rgb(0,223,223)',
        backgroundColor: 'white',
    },
    buttonRedHouseMember: {
        // marginTop: 40,
        // width: '50%',
        // left: '25%',
        width: '25%',
        // left: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#EA1744',
        // marginBottom: 15,

    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // padding: 20,
    },
    cardContainer: {
        width: '100%',
        height: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 20,
        marginVertical: 10,
        zIndex: 5,
        width: '100%',
        alignItems: 'center'
    },
    cardInBetween: {
        backgroundColor: 'rgb(0,223,223)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: '100%',
        // marginVertical: 10,
        // padding: 10,
        // paddingLeft: 20,
        paddingTop: 25,
        paddingBottom: 10,
        marginTop: -25,
        alignItems: 'center',
        zIndex: 4
    },
    cardInBetween2: {
        backgroundColor: 'rgb(0,223,223)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: '100%',
        // marginVertical: 10,
        // padding: 10,
        // paddingLeft: 20,
        paddingTop: 25,
        paddingBottom: 10,
        marginTop: -15,
        alignItems: 'center',
        zIndex: 2
    },
    settingCard: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 20,
        marginTop: -10,
        zIndex: 3,
        width: '100%',
        alignItems: 'center'
    },
    settingCard2: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 20,
        marginTop: -10,
        zIndex: 1,
        width: '100%',
        alignItems: 'center'
    },
    denyButton: {
        width: '50%',
        left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#EA1744',
        marginBottom: 15
    },
    settingContainer: {
        borderBottomWidth: 2,
        borderBottomColor: 'rgb(0,223,223)',
        width: '100%'
    },
    inputfield: {
        width: '60%',
        // left: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        fontSize: 20,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    inputfieldMembers: {
        width: '80%',
        // left: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(0, 223, 223)',
        fontSize: 20,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    divider: {
        height: 2,
        backgroundColor: 'rgb(0,223,223)',
        borderRadius: 5,
    },
    nameText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default Settings;