import React, { Component } from 'react'
import {View, Button, Text} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

import Search from './features/Search'

export class Home extends Component {
    
    constructor(props){
        super(props);
        this.state={
            username:''
        }
    }

    componentDidMount(){
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((infos)=>{
                this.setState({username:infos.data().name})
            })
    }
    
    
    render() {
        return (
            <View>
                <Text>Welcome Home ! </Text>                
                <Button title="Add Picture" onPress={()=> {this.props.navigation.navigate('addPicture')}}/>
                <Button title="Log Out" onPress={()=> {this.props.navigation.navigate('Logout')}} />
                <Button title="Go to home page" onPress={()=> {this.props.navigation.navigate('homePage',{res:this.state.username})}}/>
                <Search username={this.state.username}/>
            </View>
            )
    }
}

export default Home