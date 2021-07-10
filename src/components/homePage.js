import React, { Component } from 'react'
import {View, Button, Text} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

export class homePage extends Component {
    
    constructor(props){
        super(props);
        this.state={
            post: []
        }
    }

    componentDidMount(){
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((infos)=>{
                console.log(infos.data())
            })
    }
    
    
    render() {
        return (
            <View>
                <Text>Welcome to your profile {this.props.route.params.res} </Text>                
                <Button title="Add Picture" onPress={()=> {this.props.navigation.navigate('addPicture')}}/>
                <Button title="Log Out" onPress={()=> {this.props.navigation.navigate('Logout')}} />
            </View>
            )
    }
}

export default homePage