import React, { Component } from 'react'
import {View, Button, TextInput} from 'react-native'

import firebase from 'firebase'

export class Register extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this)
    }
    
    onSignUp(){
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({
                    name,
                    email,
                    profilePic:"https://images.ladepeche.fr/api/v1/images/view/5c2cc0838fe56f582072cedb/large/image.jpg",
                    desctiprion:""
                })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    render() {
        return (
            <View>
                <TextInput placeholder="name" onChangeText={(name) => this.setState({name})}/>
                <TextInput placeholder="email" onChangeText={(email) => this.setState({email})}/>
                <TextInput placeholder="password" secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
                
                <Button onPress={() => this.onSignUp()} title="Sign Up"/>
            </View>
            )
    }
}

export default Register