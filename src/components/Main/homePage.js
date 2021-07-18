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
            deleteImage: '',
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
                console.log(infos.data())
                this.setState({caption:infos.data().description})
                this.setState({profilePic:infos.data().profilePic})
                console.log(this.state.profilePic)
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

    deletePicture(){
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .where('downloadURL','==',this.state.deleteImage)
            .delete()
            .then(()=>{
                this.forceUpdate()
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
                <Text>{console.log(this.state.updatingDescription)}</Text>             
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
                                this.setState({deleteImage:item.downloadURL})
                                this.deletePicture}}></Button>
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