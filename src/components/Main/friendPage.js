import React, { Component } from 'react'
import {View, Button, Text, FlatList, Image,TouchableOpacity} from 'react-native'

import {homepage, home} from '../../styles/styles';

import { EvilIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

import firebase from 'firebase'
require("firebase/firestore")

export class friendPage extends Component {
    
    constructor(props){
        super(props);
        this.state={
            post: [],
            username: '',
            userProfilePic: '',
            userCaption: '',
            friend: false,
            loading: false,
        }
        this.subscribe = this.subscribe.bind(this)
        this.unSubscribe = this.unSubscribe.bind(this)
    }

    subscribe(){
        firebase.firestore()
            .collection('followers')
            .doc()
            .set({
                abonne: this.props.route.params.originalUser,
                abonnement: this.state.username
            })
            .then(()=>{this.setState({friend:true})})
            .catch((error) => {
                console.log(error)
            })
    }

    unSubscribe(){
        console.log('abonne: ' + this.props.route.params.originalUser + ' /abonnement:' + this.state.username)
        const removeAbonne = firebase.firestore()
            .collection('followers')
            .where('abonne','==',this.props.route.params.originalUser)
            .where('abonnement','==',this.state.username)
            .get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    doc.ref.delete();
                })
                this.setState({friend:false})
            })
    }


    componentDidMount(){
        let myPosts = []
        this.setState({username:this.props.route.params.res.data().name})
        console.log(this.props.route.params.res.data().name)
        // Get the user personnal info
        firebase.firestore()
        .collection('users')
        .where('name','==',this.props.route.params.res.data().name)
        .get()
        .then((infos)=>{
            infos.docs.map(doc => {
                console.log(doc.data())
                this.setState({userProfilePic: doc.data().profilePic})
                this.setState({userCaption: doc.data().description})       
                         
            })
        })
        // Get the user publications
        firebase.firestore()
            .collection('posts')
            .doc(this.props.route.params.res.id)
            .collection("userPosts")
            .orderBy("date","asc")
            .get()
            .then((infos)=>{
                let posts = infos.docs.map(doc => {
                    const data= doc.data();
                    myPosts.push(data)
                })
                this.setState({post:myPosts})
            })
            // Chech if I subscribed to the user or not
            .then(()=>{
                for (var i in this.props.route.params.friends){
                    if (this.props.route.params.friends[i] == this.state.username){
                        this.setState({friend:true})
                        console.log(this.state.friend)
                    }
                }
                this.setState({loading:true})
            })
    }
    
    
    render() {
        if (this.state.loading){
        return ( 
            <View style={homepage.main}>
                <View style={{height:"92%"}}>
                <View style={homepage.header}>
                    <View style={{flex: 1, flexDirection: "row",width:"100%"}}>
                        <Image 
                            style={{width:100,height:100,borderRadius: 400/ 2}}
                            source={{uri: this.state.userProfilePic}}/>
                    </View>
                    <Text style={{fontSize: 15, fontWeight: 'bold',}}>{this.state.username}</Text>
                </View> 
                <View>
                    <Text style={{paddingBottom: 10, paddingLeft: 2}}>{this.state.userCaption}</Text>
                </View> 
                { this.state.friend ?
                <View style={{width: "40%",paddingLeft:"3%",borderRadius:2}}>
                    <Button title="UnSubscribe" onPress={()=>{this.unSubscribe()}}/>
                </View> :
                <View style={{width: "30%",paddingLeft:"5%"}}>
                    <Button title="Subscribe" onPress={()=>this.subscribe()}/>
                </View>} 
                <Text>{console.log(this.state.post)}</Text>
                <FlatList data={this.state.post} 
                        renderItem = {({item}) => (
                        <View>
                            <Text style={home.publicationTextHeader}>{item.username}</Text>
                            <Image style={home.publicationImage}
                            source={{uri: item.downloadURL}}/>
                            <Text style={home.publicationCaption}>Description: {item.caption}</Text>
                        </View>
                        )}
                />
                </View>
                <View style={home.bottomButton}>
                    <FontAwesome5 name="home" size={24} color="black" onPress={()=> {this.props.navigation.navigate('Home')}}/>
                    <EvilIcons name="plus" size={40} color="black" onPress={()=> {this.props.navigation.navigate('addPicture',{res:this.state.username,type:"newPost"})}} />
                    <AntDesign name="search1" size={32} color="black" onPress={()=> {this.props.navigation.navigate('searchBar')}} />
                    <MaterialIcons name="logout" size={32} color="black" onPress={()=> {this.props.navigation.navigate('Logout')}} />
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('homePage')}}>
                        <Image source={{uri: this.state.userProfilePic}} style={{width: 32,height:32, borderRadius: 400/ 2}}/>
                    </TouchableOpacity>
                </View>         
             </View>
        )}
        return (
            <View><Text>Loading...</Text></View>)
        }
}

export default friendPage