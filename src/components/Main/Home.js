import React, { Component } from 'react'
import {View, Button, TextInput,FlatList,Text, TouchableOpacity, Image} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

export class Home extends Component {
    
    constructor(props){
        super(props);
        this.state={
            username:'',
            userList: [],
            userFriends: [],
            allUsers:[],
            friendsInfo:[],
            friendsPosts:[],
            loading: false,
            haveFriends: false,
            search: ''
        }
        this.searchUser = this.searchUser.bind(this)
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
                        // get the 2 latest posts of my friends
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
                                this.setState({friendsPosts: timelinePosts})
                                this.setState({haveFriends:true})
                                this.setState({loading:true})
                            })
                        }}
                        /*timelinePosts.sort(function(a,b){
                            return new Date(b.date) - new Date(a.date)
                        })*/
                    })
                })
            })
        
    }
    

    componentDidMount(){
        this.props.navigation.addListener('focus', () => {
            this.ComponentRefresh()})
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
    
    
    render() {
        if (this.state.loading){
        return (
            <View>
                <Text>Welcome Home ! </Text>                
                <Button title="Add Picture" onPress={()=> {this.props.navigation.navigate('addPicture',{res:this.state.username,type:"newPost"})}}/>
                <Button title="Go to home page" onPress={()=> {this.props.navigation.navigate('homePage',{res:this.state.username})}}/>
                {  
                this.state.haveFriends ?
                <FlatList 
                        numColumns={1}
                        data={this.state.friendsPosts} 
                        renderItem = {({item}) => (
                        <View>
                            <Text>Description: {item.caption}</Text>
                            <Image 
                            style={{width:100,height:100}}
                            source={{uri: item.downloadURL}}/>
                        </View>)}
                    />
                :
                <View>
                <Text>You can subscribe to:</Text>
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
                <View>
                    <TextInput placeholder="Search User" onChangeText={(search)=>{
                        this.setState({search})
                        this.searchUser(this.state.search)}}/>
                    {
                        this.state.search != '' ?
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
                        :
                        <View></View>
                                        }
                </View>
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

export default Home