import React, { Component } from 'react'
import {View,Button,Text, TouchableOpacity, Image} from 'react-native'
import {login} from '../../styles/styles'

import firebase from 'firebase'
require("firebase/firestore")

import {home} from '../../styles/styles';

import { EvilIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

export class Update extends Component {
    
    constructor(props){
        super(props);
        this.state={
            username: '',
            userImagePic: '',
            userCaption: '',
            loading: false,
        }
    }

   

    componentDidMount(){
        firebase.firestore()
        .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((infos)=>{
                this.setState({userCaption:infos.data().description})
                this.setState({userImagePic:infos.data().profilePic})
                this.setState({username:infos.data().username})
                this.setState({loading:true})
            })
        }

    render() {
        if (this.state.loading){
        return(
            <View style={{height:"100%"}}>
                <View style={{height:"92%"}}>
                    <View style={{height:"40%",flex:1,alignItems:"center",justifyContent:"center"}}>
                    <Image 
                        style={{width:200,height:200,borderRadius: 400/ 2}}
                        source={{uri: this.state.userImagePic}}/>
                    <Text>{this.state.userCaption}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"space-around"}}>
                        <Button style={login.input} title=" Update caption"></Button>
                        <Button style={login.input} title=" Update Profile pic"></Button>
                    </View>
                </View>
                <View style={home.bottomButton}>
                    <FontAwesome5 name="home" size={24} color="black" onPress={()=>{this.props.navigation.navigate('Home')}} />
                    <EvilIcons name="plus" size={40} color="black" onPress={()=> {this.props.navigation.navigate('addPicture',{res:this.state.username,type:"newPost"})}} />
                    <AntDesign name="search1" size={32} color="black" onPress={()=> {this.props.navigation.navigate('searchBar')}} />
                    <MaterialIcons name="logout" size={32} color="black" onPress={()=> {this.props.navigation.navigate('Logout')}} />
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('homePage')}}>
                        <Image source={{uri: this.state.userProfilePic}} style={{width: 32,height:32, borderRadius: 400/ 2}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
        }
        else {
            return(
                <View><Text>Loading...</Text></View>
            )
        }
    }
}

export default Update