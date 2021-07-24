import React, { Component } from 'react'
import {View, Button, TextInput,Pressable,Text} from 'react-native'

import firebase from 'firebase'
import {styles, login} from '../../styles/styles'
import {TextInput2} from '../Features/TextInput2'


export class Login extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            securePassword: true,
        }
        this.onSignIn = this.onSignIn.bind(this)
    }
    
    onSignIn(){
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            this.props.navigation.navigate('Home')
        })
        .catch((error) => {
            console.log(error)
        })
    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={login.main}>
                    <TextInput style={login.input} textAlign={'right'} placeholder="email" onChangeText={(email) => this.setState({email})}/>
                    <TextInput style={login.input} placeholder="password" secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>

                    <Pressable style={login.signIn} onPress={() => this.onSignIn()}>
                        <Text style={login.signInText}>Sign In</Text>
                    </Pressable>
                    
                    <Text>No Account ? <Text style={login.signUpText} onPress={()=>{this.props.navigation.navigate("Register")}}>Sign Up</Text></Text>
                </View>
            </View>
            )
    }
}

export default Login