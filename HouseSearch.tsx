import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCross, faGear, faInfoCircle, faSearch, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import HouseService from './Services/HouseService'
import UserService from './Services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HouseItem = ({house, navigation}) => {
    const initialHouseState = house;

    async function joinHouse() {
        const userId = await AsyncStorage.getItem('@userId');
        UserService.updateHouse(userId, house)
        .then(async response => {
            console.log(response.data)
            var houseId = house.id + ''
            await AsyncStorage.setItem("@houseId", houseId)
            navigation.navigate('HouseAwait')
        })
        .catch(e => {
            console.log(e);
            // window.location.reload();
        })
    }

    return (
        <View style={styles.houseItemBorder}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'column', width: '70%' }}>
                    <Text style={styles.text}>{house.name}</Text>
                    {house.userEntities !== null && <Text style={styles.text}>Members: {house.userEntities.length}</Text>}
                </View>
                <Pressable style={styles.button} onPress={(house) => {joinHouse()}}>
                    <Text style={styles.text}>Join</Text>
                </Pressable>
            </View>
        </View>
    )
}

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked, setHouse }) => {

    function searchFilterFunction(text) {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            HouseService.findByHousename(text)
          .then(response => {
            setHouse(response.data);
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });

            setSearchPhrase(text);
        } else {
            // Inserted text is blank
            setSearchPhrase(text);
        }
    };

    return (
        <View style={styles.container}>
            <View
                style={
                    clicked
                        ? styles.searchBar__clicked
                        : styles.searchBar__unclicked
                }
            >
                {/* search Icon */}
                <FontAwesomeIcon
                    icon={faSearch}
                    size={20}
                    color="black"
                    style={{ marginLeft: 1 }}
                />
                {/* Input field */}
                <TextInput
                    style={styles.input}
                    placeholder="Search house"
                    value={searchPhrase}
                    onChangeText={(text) => searchFilterFunction(text)}
                    returnKeyType={"search"}
                    onFocus={() => {
                        setClicked(true);
                    }}
                />
                {/* cross Icon, depending on whether the search bar is clicked or not */}
                {clicked && (
                    <Pressable onPress={() => { setSearchPhrase("") }}>
                        <FontAwesomeIcon icon={faXmark} size={25} color="black" style={{ padding: 1 }} />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const HouseSearch = ({ navigation }) => {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [clicked, setClicked] = useState(false);

    const initialHouseState = {
        id: null,
        name: "",
        city: "",
        userEntities: [],
    }

    const [house, setHouse] = useState([initialHouseState])

    const getAllHouses = () => {
        HouseService.getAll()
        .then(response => {
            setHouse(response.data);
            console.log(response.data)
        })
        .catch(e => {
            console.log(e);
            // window.location.reload();
        })
    }

    useEffect(() => {
        getAllHouses()
      }, [])

    function joinHouse(house) {
        UserService.updateHouse(AsyncStorage.getItem('@userId'), house)
        .then(response => {
            console.log(response.data)
            navigation.navigate('HouseAwait')
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
            <View style={{ width: '100%', alignItems: 'center' }}>

                <SearchBar
                    searchPhrase={searchPhrase}
                    setSearchPhrase={setSearchPhrase}
                    clicked={clicked}
                    setClicked={setClicked}
                    setHouse={setHouse}
                />
                {house[0] && house.map((houses, i) => {return (<HouseItem house={houses} navigation={navigation}/>)})}
                
            </View>
            <Pressable style={styles.buttonBack} onPress={() => { navigation.navigate('Houses') }
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
    button: {
        width: '30%',
        // left: '200%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
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
    container: {
        marginVertical: 15,
        // // justifyContent: "flex-start",
        // // alignItems: "center",
        // flexDirection: "row",
        // width: "100%",

    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "90%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        width: "90%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        width: "90%",
    },
    houseItemBorder: {
        padding: 10,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgb(0,223,223)',
        width: '90%',
        borderRadius: 15,
    }
});

export default HouseSearch;