import React, { Component } from 'react'
import {View,TextInput,FlatList,Text, TouchableOpacity, Image} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

import {home} from '../../styles/styles';

import { EvilIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

export class searchBar extends Component {
    
    constructor(props){
        super(props);
        this.state={
            search: '',
            userList: [],
            username:'',
            userFriends:'',
        }
        this.searchUser = this.searchUser.bind(this)
    }

    searchUser(search){
        let myUsers = []
        firebase.firestore()
            .collection('users')
            .where('name','>=',search)
            .get()
            .then((infos)=>{
                infos.docs.map(doc => {
                    myUsers.push(doc)
                })
                this.setState({userList: myUsers})
            })
    }

    componentDidMount(){
        this.setState({loading:false})
        let myFriends = []
        // get username
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((infos)=>{
                this.setState({username:infos.data().name})
                this.setState({userProfilePic: infos.data().profilePic})
                // get user friends
                firebase.firestore()
                .collection('followers')
                .where('abonne','==',this.state.username)
                .get()
                .then((infos)=>{
                    infos.docs.map(doc => {
                        myFriends.push(doc.data().abonnement)                        
                    })
                    this.setState({userFriends:myFriends})
                })
            })
        }

    render() {
        return(
            <View style={{height:"100%"}}>
                <View style={{height:"90%"}}>
                <View style={home.searchContainer}>
                    <TextInput placeholder="Search User" style={home.searchBar}
                            onChangeText={(search)=>{
                            this.setState({search})
                            this.searchUser(this.state.search)}}/>
                </View>
                <View style={{height:"80%"}}>
                    {
                this.state.search != '' ?
                <View style={{paddingLeft:"5%"}}> 
                    <FlatList
                        numColumns={1}
                        horizental={false}
                        data={this.state.userList}
                        renderItem={({item})=>(
                            <TouchableOpacity 
                                onPress={()=>{
                                        this.setState({search:''});
                                        this.props.navigation.navigate('friendPage',{res: item,
                                                                                    friends: this.state.userFriends,
                                                                                    originalUser: this.state.username})}}>
                                <Text>{item.data().name}</Text>
                            </TouchableOpacity>
                        )} />
                </View>
                        :
                        <View></View>
                                        }
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
}

export default searchBar