import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Pressable, Image, Dimensions, Modal, Alert, StatusBar, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear, faInfoCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import UserService from './Services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Calender = ({ navigation }) => {
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    // You can turn it in to your desired format
    var date = year + '-' + month + '-' + day;
    var dateAdvanced = year + '-' + (month + 1) + '-' + day;

    if (month == 12) {
        dateAdvanced = (year + 1) + '-' + 1 + '-' + day
    }

    const [selectedDays, setSelectedDays] = useState({})

    async function retrieveDates() {
        UserService.get(await AsyncStorage.getItem('@userId'))
            .then(response => {
                response.data.date.forEach(date => {
                    let object = { [date]: { selected: true, disableTouchEvent: false, selectedTextColor: 'black', selectedColor: 'rgb(0,223,223)' } }
                    setSelectedDays(selectedDays => ({
                        ...selectedDays, ...object
                    }))
                });
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {
        retrieveDates()
    }, [])

    async function saveDates() {
        const keys = Object.keys(selectedDays)
        UserService.updateDates(await AsyncStorage.getItem('@userId'), keys)
            .then(response => {
                navigation.navigate('Homescreen')
            })
            .catch(e => {
                console.log(e);
            })
    }

    var getDaysArray = function (start, end) {
        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        return arr;
    };

    let startdate = year + '-' + month + '-' + (day + 1);
    let enddate = year + '-' + (month + 1) + '-' + (day + 1);
    if (month == 12) {
        enddate = (year + 1) + '-' + 1 + '-' + (day + 1);
    }

    function allWeekdays() {
        setSelectedDays({})
        var daylist = getDaysArray(new Date(startdate), new Date(enddate));
        // daylist.map((v)=>v.toISOString().slice(0,10)).join("");
        console.log(daylist)
        daylist.forEach(day => {
            if (day.getDay() > 1 && day.getDay() < 7) {
                let date2 = day.toISOString().substr(0, 10);
                let object = { [date2]: { selected: true, disableTouchEvent: false, selectedTextColor: 'black', selectedColor: 'rgb(0,223,223)' } }
                setSelectedDays(selectedDays => ({
                    ...selectedDays, ...object
                }))
            }
        });
    }

    function always() {
        var daylist = getDaysArray(new Date(startdate), new Date(enddate));
        daylist.map((v) => v.toISOString().slice(0, 10)).join("");
        console.log(daylist)
        daylist.forEach(day => {
            let date2 = day.toISOString().substr(0, 10);
            let object = { [date2]: { selected: true, disableTouchEvent: false, selectedTextColor: 'black', selectedColor: 'rgb(0,223,223)' } }
            setSelectedDays(selectedDays => ({
                ...selectedDays, ...object
            }))
        });
    }

    return (
        <View style={styles.backgroundWhite}>
            <StatusBar
                backgroundColor="white"
                barStyle="dark-content"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Pressable style={styles.buttonTop} onPress={() => { allWeekdays() }
                }>
                    <Text style={styles.text}>All weekdays</Text>
                </Pressable><Pressable style={styles.buttonTop} onPress={() => { always() }
                }>
                    <Text style={styles.text}>Always</Text>
                </Pressable>
            </View>
            <Calendar
                // Initially visible month. Default = now
                // initialDate={date}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={date}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={dateAdvanced}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={day => {
                    let object = { [day.dateString]: { selected: true, disableTouchEvent: false, selectedTextColor: 'black', selectedColor: 'rgb(0,223,223)' } }
                    let selected = day.dateString;
                    let present = false;
                    const keys = Object.keys(selectedDays)
                    console.log(keys)
                    keys.forEach((key, index) => {
                        if (key == selected) {
                            present = true;
                            let copyOfObject = { ...selectedDays }
                            delete copyOfObject[key]
                            setSelectedDays(selectedDays => ({
                                ...copyOfObject
                            }))
                        }
                    })

                    if (present == false) {
                        setSelectedDays(selectedDays => ({
                            ...selectedDays, ...object
                        }))
                    }
                }}
                // Handler which gets executed on day long press. Default = undefine
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                // monthFormat={'MM'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={month => {
                    console.log('month changed', month);
                }}
                // Hide month navigation arrows. Default = false
                //   hideArrows={true}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                //   renderArrow={direction => <Arrow />}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                //   disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                //   firstDay={1}
                // Hide day names. Default = false
                //   hideDayNames={true}
                // Show week numbers to the left. Default = false
                //   showWeekNumbers={true}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
                // Disable left arrow. Default = false
                //   disableArrowLeft={true}
                // Disable right arrow. Default = false
                //   disableArrowRight={true}
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={true}
                // Replace default month and year title with custom one. the function receive a date as parameter
                //   renderHeader={date => {
                //     /*Return JSX*/
                //   }}
                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={true}
                markedDates={selectedDays}
            />
            <Pressable style={styles.button} onPress={() => { saveDates() }
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
    button: {
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
    buttonTop: {
        marginTop: 20,
        marginBottom: 20,
        width: '40%',
        // left: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: 'rgb(0,223,233)',
    }
});

export default Calender;