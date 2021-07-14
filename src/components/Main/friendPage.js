import React, { Component } from 'react'
import {View, Button, Text, FlatList, Image} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

export class friendPage extends Component {
    
    constructor(props){
        super(props);
        this.state={
            post: [],
            username: '',
            friend: false,
            loading: false
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
            <View>
                
                    <Text>{this.state.username} </Text>                
                    <FlatList data={this.state.post} 
                            renderItem = {({item}) => (
                            <View>
                                <Text>Username: {this.state.username} Description: {item.caption}</Text>
                                <Image 
                                style={{width:100,height:100}}
                                source={{uri: item.downloadURL}}/>
                            </View>)}
                    />
                    { this.state.friend ?
                    <Button title="UnSubscribe" onPress={()=>{this.unSubscribe()}}/> :
                    <Button title="Subscribe" onPress={()=>this.subscribe()}/>}
                    <Button title="Go to the timeline" onPress={()=> {this.props.navigation.goBack()}}/>
                    <Button title="Log Out" onPress={()=> {this.props.navigation.navigate('Logout')}} />
                </View>
        )}
        return (
            <View><Text>Loading...</Text></View>)
        }
}

export default friendPage