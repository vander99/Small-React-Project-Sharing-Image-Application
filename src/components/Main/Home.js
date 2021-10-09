import React, { Component } from 'react';
import {View,ScrollView,FlatList,Text, TouchableOpacity, Dimensions, Image} from 'react-native';

import firebase from 'firebase';
import {home} from '../../styles/styles';

import { EvilIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 



require("firebase/firestore")

export class Home extends Component {
    
    constructor(props){
        super(props);
        this.state={
            username:'',
            userProfilePic: '',
            userList: [],
            userFriends: [],
            allUsers:[],
            friendsInfo:[],
            friendsPosts:[],
            loading: false,
            haveFriends: false,
            haveFriendsPub: false,
        }
        this.ComponentRefresh = this.ComponentRefresh.bind(this)
    }

    ComponentRefresh(){
        this.setState({loading:false})
        let myFriends = []
        let timelinePosts = []        
        let users = []
        let myFriendsInfo = []
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
                    // get the userList
                    this.setState({userFriends:myFriends})
                    firebase.firestore()
                    .collection('users')
                    .where('name','!=',this.state.username)
                    .get()
                    .then((infos)=>{
                        infos.docs.map(doc => {
                            users.push(doc)
                        })
                        this.setState({allUsers: users})
                        if (myFriends.length == 0){
                            this.setState({haveFriends: false})
                            this.setState({loading: true})
                        }
                        else{
                        // get the full information of my friends
                        for (var i =0;i < this.state.userFriends.length; i++){
                            for (var j=0;j< this.state.allUsers.length;j++){
                                if (this.state.userFriends[i] == this.state.allUsers[j].data().name){
                                    myFriendsInfo.push(this.state.allUsers[j])
                                    j=this.state.allUsers.length
                                }
                            }
                            this.setState({friendsInfo:myFriendsInfo})
                        } 
                        // get the latest posts of my friends
                        for (var ii=0; ii<this.state.friendsInfo.length;ii++){
                            firebase.firestore()
                            .collection('posts')
                            .doc(this.state.friendsInfo[ii].id)
                            .collection("userPosts")
                            .orderBy("date","asc")
                            .limit(2)
                            .get()
                            .then((infos)=>{
                                let posts = infos.docs.map(doc => {
                                    const data= doc.data();
                                    timelinePosts.push(data)
                                })
                                if (timelinePosts.length != 0){
                                    this.setState({haveFriendsPub:true})
                                    this.setState({friendsPosts: timelinePosts})
                                }
                                this.setState({haveFriends:true})
                                this.setState({loading:true})
                            })
                        }}
                    })
                })
            })
        
    }
    

    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.ComponentRefresh()})
    }
    
    render() {
        if (this.state.loading){
        return (
            <View style={home.main}>
                <View style={{height:"6%",width:"100%", justifyContent:"center"}}>
                    <Image source={require('../../styles/SharePicc.png')} style={{height:"90%",width:"40%",paddingLeft:10}}/>
                </View>
                {  
                this.state.haveFriends ?
                
                <View style={home.timeline}>
                {
                this.state.haveFriendsPub ?
                <ScrollView>
                <FlatList 
                        numColumns={1}
                        data={this.state.friendsPosts} 
                        renderItem = {({item}) => (
                        <View>
                            <Text style={home.publicationTextHeader}>{item.username}</Text>
                            <Image style={{width:Dimensions.get('window').width,height:Dimensions.get('window').width}}
                            source={{uri: item.downloadURL}}
                            /*style={home.publicationImage}*//>
                            <Text style={home.publicationCaption}>Description: {item.caption}</Text>
                        </View>)}
                    />
                </ScrollView>
                :
                <View style={{height:"60%",alignItems:"center",justifyContent:"center"}}><Text>Your friends have nothing to show :(</Text></View>
                }
                </View>
                :
                <View style={{height:"86%",width:"100%",alignItems:"center",paddingTop:"10%"}}>
                <Text style={{paddingBottom:10,fontSize:20}}>You can subscribe to:</Text>
                <FlatList data={this.state.allUsers} renderItem={({item}) => {
                    
                    return(
                    <TouchableOpacity onPress={()=>{
                        firebase.firestore()
                            .collection('followers')
                            .doc()
                            .set({
                            abonne: this.state.username,
                            abonnement: item.data().name
                            })
                            .then(()=>{
                                const index = this.state.allUsers.indexOf(item)
                                if (index > -1){
                                    this.state.allUsers.splice(index,1);
                                    this.setState({allUsers:this.state.allUsers})
                                } })
                    }}>
                        <Text>{item.data().name}</Text>
                    </TouchableOpacity>)} 
                      
                }/>
                </View>
                }
            
                <View style={home.bottomButton}>
                    <FontAwesome5 name="home" size={24} color="black" />
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
        return(
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
}

export default Home