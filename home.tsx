import React, { useState, useEffect, } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear, faInfoCircle, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import UserService from './Services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HouseService from './Services/HouseService';
import PaymentService from './Services/PaymentService';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';

const AcceptMember = (user) => {
    const initialUser = {
        name: ''
    }


    const [user1, setUser1] = useState(user)

    useEffect(() => { setUser1(user) }, [user]);

    function Accept() {
        UserService.updateHouseStatus(user.user.id, 'ACCEPTED')
            .then(response => {
                console.log(response.data)
                setUser1(initialUser)
            })
            .catch(e => {
                console.log(e);
                // window.location.reload();
            })
    }

    function NotAccepted() {
        UserService.updateHouseStatus(user.user.id, 'NOT_ACCEPTED')
            .then(response => {
                console.log(response.data)
                setUser1(initialUser)
            })
            .catch(e => {
                console.log(e);
                // window.location.reload();
            })
    }
    return (
        <View>
            {user1.name !== '' && <View style={[styles.card, styles.acceptUserCard]}>
                <Text style={styles.cardTitle}>{user.user.name} would like to join your house, do you accept?</Text>
                <View style={styles.rowContainer}>
                    <Pressable style={styles.acceptButton} onPress={() => Accept()}>
                        <Text style={styles.text}>Accept</Text>
                    </Pressable>
                    <Pressable style={styles.denyButton} onPress={() => NotAccepted()}>
                        <Text style={styles.text}>Deny</Text>
                    </Pressable>
                </View>
            </View>}
        </View>
    )
}


const DonateSection = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View>
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
                        <Text style={styles.cardTitle}>Ads are horrible! That's why I didn't put any ads on this app. It does however cost me money to keep this app in the air. So any donations would really be appreciated :)</Text>
                        <Pressable
                            style={styles.buttonCloseModal}
                            onPress={() => { setModalVisible(!modalVisible); }}>
                            <Text style={styles.text}>Hide Message</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.cardTitle}>If you use this app regularly, please consider donating me a pint <FontAwesomeIcon icon={faInfoCircle} size={20}></FontAwesomeIcon></Text>
            </TouchableOpacity>
            <Pressable style={[styles.buttonDonate, styles.button]} onPress={() => { Linking.openURL('https://www.buymeacoffee.com/mexsteens') }}>
                <Text style={styles.text}>Donate :)</Text>
            </Pressable>
        </View>
    )
}

const FloatingActionButton = ({ navigation }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Add')} // Replace this with your desired function
            style={{
                position: 'absolute',
                right: 16,
                bottom: 30,
                width: 80,
                height: 80,
                borderRadius: 50,
                backgroundColor: 'rgb(0, 223, 223)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <FontAwesomeIcon icon={faPlus} size={40} color="#000" />
        </TouchableOpacity>
    );
};


const RecentlyPayed = ({ payment }) => {
    const avatar = createAvatar(bottts, {
        seed: payment.userEntity.name
    }).toString();
    return (<View>
        <View style={styles.divider} />
        <View style={styles.rowContainer}>
            {/* <Image
                style={styles.profilePic}
                source={{ uri:  }}
            /> */}
            <View style={styles.profilePicView}><SvgXml xml={avatar} style={styles.profilePic} /></View>
            <Text style={styles.nameText}>{payment.userEntity.name}</Text>
            <Text style={styles.priceText}>+ {payment.amount}</Text>
        </View>
    </View>
    )

}

const AppBarContent = ({ navigation, yourPaymentTurn, calenderUpdate }) => {
    return (
        <View style={styles.appBarContent}>
            {!yourPaymentTurn && !calenderUpdate && <TouchableOpacity>
                <FontAwesomeIcon icon={faUser} size={20} color={'#D0E562'} />
            </TouchableOpacity>}
            {yourPaymentTurn && <TouchableOpacity>
                <FontAwesomeIcon icon={faUser} size={20} color={'#EA1744'} />
            </TouchableOpacity>}
            {calenderUpdate && !yourPaymentTurn && <TouchableOpacity>
                <FontAwesomeIcon icon={faUser} size={20} color={'#F49F0A'} />
            </TouchableOpacity>}
            {!yourPaymentTurn && !calenderUpdate && <Text style={styles.text}>You are all up to date!</Text>}
            {yourPaymentTurn && <Text style={styles.text}>It's your turn to pay!</Text>}
            {calenderUpdate && !yourPaymentTurn && <Text style={styles.text}>You need to update your calender!</Text>}
            <TouchableOpacity onPress={() => { navigation.navigate('Settings') }}>
                <FontAwesomeIcon icon={faGear} size={20} />
            </TouchableOpacity>
        </View>
    );
};

const MyStatelessWidget = ({ navigation, user, paymentTurn, yourPaymentTurn, calenderUpdate, payments }) => {

    return (
        <View style={styles.container}>
            {!yourPaymentTurn && !calenderUpdate && <View style={styles.appBarUpToDate}>
                <AppBarContent navigation={navigation} yourPaymentTurn={yourPaymentTurn} calenderUpdate={calenderUpdate} />
                {paymentTurn && <Text style={styles.cardTitle}>It's {paymentTurn.name}'s turn to pay</Text>}
            </View>}
            {yourPaymentTurn && <View style={styles.appBarNeedToPay}>
                <AppBarContent navigation={navigation} yourPaymentTurn={yourPaymentTurn} calenderUpdate={calenderUpdate} />
                {/* { paymentTurn && <Text style={styles.cardTitle}>It's {paymentTurn.name}'s turn to pay</Text>} */}
            </View>}
            {calenderUpdate && !yourPaymentTurn && <View style={styles.appBarCalenderUpdate}>
                <AppBarContent navigation={navigation} yourPaymentTurn={yourPaymentTurn} calenderUpdate={calenderUpdate} />
            </View>}
            <View style={styles.body}>
                <View style={styles.cardContainer}>
                    {user && <AcceptMember user={user} />}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            Adjust or fill in the days you will be in the apartment
                        </Text>
                        <Pressable style={styles.button} onPress={() =>
                            navigation.navigate('Calender')
                        }>
                            <Text style={styles.text}>Calender</Text>
                        </Pressable>
                    </View>
                    <View style={[styles.card, styles.recentPaymentsCard]}>
                        <Text style={styles.cardTitle}>Recent payments</Text>
                        {payments[0] && payments.map((payment, i) => { return (<RecentlyPayed payment={payment} />) })}
                    </View>
                    <View style={styles.card}>
                        <DonateSection />
                    </View>
                </View>
            </View>
        </View>
    );
};

const Homescreen = ({ navigation }) => {

    const InitialUser = {
        email: '',
        id: null,
        name: '',
        statusEnum: '',
        date: []
    }

    const InitialHouse = {
        id: null,
        name: '',
        city: '',
        userEntities: [InitialUser],
        paymentEntities: [],
    }

    const InitialPaymentTurn = {
        id: null,
        name: '',
    }



    const [toAccept, setToAccept] = useState(false)
    const [toAcceptUser, setToAcceptUser] = useState()
    const [house, setHouse] = useState(InitialHouse);
    const [paymentTurn, setPaymentTurn] = useState(InitialPaymentTurn);
    const [yourPaymentTurn, setYourPaymentTurn] = useState(false);
    const [recentPayments, setRecentPayments] = useState([]);
    // const [activeUser, setActiveUser] = useState(InitialUser);
    const [calenderUpdate, setCalenderUpdate] = useState(false);


    async function retrieveHouse() {
        HouseService.get(await AsyncStorage.getItem('@houseId'))
            .then(response => {
                setHouse(response.data)
                usersToBeAccepted(response.data)
                console.log(response.data)
            })
            .catch(e => {
                console.log(e);
                // window.location.reload();
            })
    }

    async function retrievePaymentTurn() {
        const userId = await AsyncStorage.getItem('@userId')
        PaymentService.getpaymentturn(await AsyncStorage.getItem('@houseId'))
            .then(response => {
                setPaymentTurn(response.data)
                if (response.data.id == userId) {
                    setYourPaymentTurn(true)
                } else {
                    setYourPaymentTurn(false)
                }
                console.log(response.data)
            })
            .catch(e => {
                console.log(e);
                // window.location.reload();
            })
    }

    async function retrieveUser() {
        const userId = await AsyncStorage.getItem('@userId')
        UserService.get(userId)
            .then(response => {
                if (response.data.statusEnum !== 'ACCEPTED' && response.data.statusEnum !== 'JOINED') {
                    navigation.replace('Houses', { kicked: true, notaccepted: false })
                }
            })
            .catch(e => {
                console.log(e);
                // window.location.reload();
            })
    }

    async function updateCalender(userActive) {
        var calenderUpdateValue = false;
        console.log(userActive)
        var oneMonthAgo = new Date();
        for (var i = 0; i < userActive.date.length; i++) {
            var dateformat = new Date(userActive.date[i])
            if (dateformat > oneMonthAgo) {
                calenderUpdateValue = false
                // var calenderNotification = await AsyncStorage.getItem("calenderNotification"); //Just-updated, up-to-date, send, already-send
                // if (calenderNotification == "already-send") {
                //     await AsyncStorage.setItem("calenderNotification", "just-updated");
                //     saveUserCalenderNotification(false);
                // }
                break;
            } else {
                calenderUpdateValue = true
                // var calenderNotification = await AsyncStorage.getItem("calenderNotification"); //Just-updated, up-to-date, send, already-send
                // if (calenderNotification != "already-send") {
                //     sentUserCalenderNotification();
                //     await AsyncStorage.setItem("calenderNotification", "already-send");
                // }
            }
        }
        setCalenderUpdate(calenderUpdateValue)
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            retrieveHouse()
            retrievePaymentTurn()
            retrieveRecentPayments()
            retrieveUser()
        });
    }, [])

    async function usersToBeAccepted(houseData) {
        const userId = await AsyncStorage.getItem('@userId')
        houseData.userEntities.forEach(user => {
            if (user.statusEnum === 'PENDING') {
                setToAccept(true)
                setToAcceptUser(user)
            }
            if (user.id === userId) {
                updateCalender(user)
            }
        });
    }

    async function retrieveRecentPayments() {
        const houseId = await AsyncStorage.getItem('@houseId')
        PaymentService.getrecentpayments(houseId)
            .then(response => {
                setRecentPayments(response.data)
            })
            .catch(e => {
                console.log(e)
            })

    }

    return (
        <View style={styles.backgroundWhite}>
            {!yourPaymentTurn && !calenderUpdate && <StatusBar
                backgroundColor="#D0E562"
                barStyle="dark-content"
            />}
            {yourPaymentTurn && <StatusBar
                backgroundColor="#EA1744"
                barStyle="dark-content"
            />}
            {calenderUpdate && !yourPaymentTurn && <StatusBar
                backgroundColor="#F49F0A"
                barStyle="dark-content"
            />}
            <ScrollView>
                <MyStatelessWidget navigation={navigation} user={toAcceptUser} paymentTurn={paymentTurn} yourPaymentTurn={yourPaymentTurn} calenderUpdate={calenderUpdate} payments={recentPayments} />
            </ScrollView>
            <FloatingActionButton navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    backgroundWhite: {
        backgroundColor: 'rgb(255,255,255)',
        height: Dimensions.get('window').height
    },
    container: {
        flex: 1,
    },
    appBarUpToDate: {
        height: 75,
        backgroundColor: '#D0E562',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 1
    },
    appBarNeedToPay: {
        height: 45,
        backgroundColor: '#EA1744',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 1,
        marginTop: 0,
    },
    appBarCalenderUpdate: {
        height: 45,
        backgroundColor: '#F49F0A',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 1,
        marginTop: 0,
    },
    appBarContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    text: {
        color: 'black',
        fontSize: 20,
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
    },
    card: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 20,
        marginVertical: 10,
    },
    recentPaymentsCard: {
        backgroundColor: 'rgb(0, 223, 223)',
        paddingTop: 50,
        marginTop: -30,
        zIndex: -1
    },
    acceptUserCard: {
        backgroundColor: 'rgb(0, 223, 223)',
        paddingTop: 40,
        marginTop: -20,
        zIndex: -1
    },
    cardTitle: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginBottom: 14,
    },
    button: {
        width: '50%',
        left: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    },
    acceptButton: {
        width: '40%',
        right: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#D0E562',
    },
    denyButton: {
        width: '40%',
        left: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#EA1744',
    },
    buttonDonate: {
        marginTop: 10
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
    buttonText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    divider: {
        height: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 7,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    profilePic: {
        width: Dimensions.get('window').width * 0.14,
        height: Dimensions.get('window').width * 0.14,

        // backgroundColor: '#7c94b6',
    },
    profilePicView: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'white',
    },
    nameText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    priceText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    iconStyle: {
        fontSize: 40,
        color: 'black'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
});

export default Homescreen;