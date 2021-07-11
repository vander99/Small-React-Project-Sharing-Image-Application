import React, { Component } from 'react'
import {View, Button, Text, FlatList, Image} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

export class homePage extends Component {
    
    constructor(props){
        super(props);
        this.state={
            post: [],
            username: ''
        }
    }


    componentDidMount(){
        let myPosts = []
        this.setState({username:this.props.route.params.res})
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
    }
    
    
    render() {
        return (
            <View>
                <Text>Welcome to your profile {this.props.route.params.res} </Text>                
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
}

export default homePage