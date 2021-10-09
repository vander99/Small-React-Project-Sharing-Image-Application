import React, { Component } from 'react'
import {View, ScrollView, Button, Text, FlatList, Image, TouchableOpacity, TextInput} from 'react-native'

import { EvilIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 

import firebase from 'firebase'
require("firebase/firestore")

import {homepage,home} from '../../styles/styles';

export class homePage extends Component {
    
    constructor(props){
        super(props);
        this.state={
            post: [],
            username: '',
            loading: false,
            caption: '',
            profilePic: '',
            newDescription: '',
            havePost: '',
        }
        this.saveDescription = this.saveDescription.bind(this)
        this.deletePicture = this.deletePicture.bind(this)
    }


    componentDidMount(){
        let myPosts = []
        // Get my username
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((infos)=>{
                this.setState({username:infos.data().name})})
        // Get all my informations
            firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((infos)=>{
                this.setState({caption:infos.data().description})
                this.setState({profilePic:infos.data().profilePic})
            })
        // Get all my posts
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("date","asc")
            .get()
            .then((infos)=>{
                let posts = infos.docs.map(doc => {
                    const data= doc.data();
                    myPosts.push(data)
                })
                if (myPosts.length != 0){
                    this.setState({havePost:true})
                    this.setState({post:myPosts})
                }
                this.setState({loading: true})
            })
    }

    saveDescription(){
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
                description: this.state.newDescription
            }).then(()=>{
                this.setState({caption:this.state.newDescription})
                this.setState({updatingDescription:false})
            })
    }

    deletePicture(thePost){
        let savePost = thePost
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .where('downloadURL','==',thePost.downloadURL)
            .get()
            .then((snapshot)=>{
                snapshot.forEach(function(doc){
                    doc.ref.delete();
                })
                // Get the updated list of posts
                let myPosts = []
                firebase.firestore()
                .collection('posts')
                .doc(firebase.auth().currentUser.uid)
                .collection("userPosts")
                .orderBy("date","asc")
                .get()
                .then((infos)=>{
                    let posts = infos.docs.map(doc => {
                        const data= doc.data();
                        myPosts.push(data)
                    })
                    this.setState({post:myPosts})
                    if (this.state.post.length == 0){
                        this.setState({havePost:false})
                    }
                })
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
                        source={{uri: this.state.profilePic}}/>
                    <View style={{position:"relative"}}>
                    <EvilIcons name="plus" size={30} color="black" style={{position: "absolute",left:-30}} onPress={()=> {this.props.navigation.navigate('Update')}} />
                    </View>
                    </View>
                    <Text style={{fontSize: 15, fontWeight: 'bold',}}>{this.state.username}</Text>
                </View>  
                <View>
                    <Text style={{paddingBottom: 10, paddingLeft: 2}}>{this.state.caption}</Text>
                </View> 
                {
                this.state.havePost ?
                <View>
                <FlatList data={this.state.post} 
                        renderItem = {({item}) => (
                        <ScrollView>
                            <Text style={home.publicationTextHeader}>{item.username}</Text>
                            <Image style={home.publicationImage}
                            source={{uri: item.downloadURL}}/>
                            <Text style={home.publicationCaption}>Description: {item.caption}</Text>
                            <Button title="Delete Picture" onPress={()=>{
                                this.deletePicture(item)
                            }}></Button>
                        </ScrollView>
                        )}
                />
                </View>
                :
                <View style={{height:"60%", justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:15}}>No post to display</Text></View>
                }
                </View>
                <View style={home.bottomButton}>
                    <FontAwesome5 name="home" size={24} color="black" onPress={()=> {this.props.navigation.navigate('Home')}}/>
                    <EvilIcons name="plus" size={40} color="black" onPress={()=> {this.props.navigation.navigate('addPicture',{res:this.state.username,type:"newPost"})}} />
                    <AntDesign name="search1" size={32} color="black" onPress={()=> {this.props.navigation.navigate('searchBar')}} />
                    <MaterialIcons name="logout" size={32} color="black" onPress={()=> {this.props.navigation.navigate('Logout')}} />
                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('homePage')}}>
                        <Image source={{uri: this.state.profilePic}} style={{width: 32,height:32, borderRadius: 400/ 2}}/>
                    </TouchableOpacity>
                </View>
                
            </View>
            )
        }
        return(
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
}

export default homePage