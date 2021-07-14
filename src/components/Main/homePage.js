import React, { Component } from 'react'
import {View, Button, Text, FlatList, Image} from 'react-native'

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
        }
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
    
    
    render() {
        if (this.state.loading){
        return (
            <View>
                <Image 
                    style={{width:100,height:100}}
                    source={{uri: this.state.profilePic}}/> 
                <Text>{this.state.username}</Text>
                <Text>Description: {this.state.caption}</Text>             
                <Button title="Add Picture" onPress={()=> {this.props.navigation.navigate('addPicture')}}/>
                <FlatList data={this.state.post} 
                        renderItem = {({item}) => (
                        <View>
                            <Text>Username: {this.state.username} Description: {item.caption}</Text>
                            <Image 
                            style={{width:100,height:100}}
                            source={{uri: item.downloadURL}}/>
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