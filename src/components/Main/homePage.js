import React, { Component } from 'react'
import {View, Button, Text, FlatList, Image, TextInput} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

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
            updatingDescription: false,
        }
        this.saveDescription = this.saveDescription.bind(this)
        this.deletePicture = this.deletePicture.bind(this)
    }


    componentDidMount(){
        let myPosts = []
        this.setState({username:this.props.route.params.res})
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
                this.setState({post:myPosts})
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
                })
            })
    }
    
    
    
    render() {
        if (this.state.loading){
        return (
            <View>
                <Image 
                    style={{width:100,height:100}}
                    source={{uri: this.state.profilePic}}/> 
                <Text>{this.state.username}</Text>
                <Text>Description: {this.state.caption}</Text>
                <Button title="Add Picture" onPress={()=> {this.props.navigation.navigate('addPicture',{type:"newPost", res:this.state.username})}}/>
                <Button title="Update profile Picture" onPress={()=> {this.props.navigation.navigate('addPicture',{type:"updatePost", res:this.state.username})}}/>
                {
                    this.state.updatingDescription ?
                    <View>
                    <TextInput placeholder="Update description" onChangeText={(newDescription) => this.setState({newDescription})}/>
                    <Button title="Update" onPress={()=> {this.saveDescription()}}></Button>
                    </View>
                :
                    <Button title="Update description" onPress={()=>{this.setState({updatingDescription:true})}}></Button>}
                <FlatList data={this.state.post} 
                        renderItem = {({item}) => (
                        <View>
                            <Text>Username: {this.state.username} Description: {item.caption}</Text>
                            <Image 
                            style={{width:100,height:100}}
                            source={{uri: item.downloadURL}}/>
                            <Button title="Delete Picture" onPress={()=>{
                                this.deletePicture(item)
                                    /*const index = this.state.post.indexOf(item)
                                    if (index > -1){
                                        this.state.post.splice(index,1);
                                        this.setState({post:this.state.post})
                                    }*/
                            }}></Button>
                        </View>)}
                />
                <Button title="Go to the timeline" onPress={()=> {this.props.navigation.navigate('Home')}}/>
                <Button title="Log Out" onPress={()=> {this.props.navigation.navigate('Logout')}} />
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