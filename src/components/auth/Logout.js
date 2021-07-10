import React from 'react';
import {View, Text, Button} from 'react-native';

import firebase from 'firebase'

export default function Logout(props, navigation) {
    const logout = () => {
        firebase.auth().signOut().then(()=>{
            props.navigation.popToTop()
        })
    }
    return(
        <View style={{flex: 1}}>
            <Text>Are you sure to logout</Text>
            <Button title="Yes" onPress={()=>logout()}></Button>
            <Button title="No" onPress={()=>{props.navigation.navigate("Home")}}></Button>
        </View>
        )
}