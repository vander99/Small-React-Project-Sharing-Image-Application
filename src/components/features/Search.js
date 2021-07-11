import React, { Component } from 'react'
import {View, TextInput,FlatList,Text, TouchableOpacity} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

export class Search extends Component {
    
    constructor(props){
        super(props);
        this.state={
            userList: []
        }
        this.searchUser = this.searchUser.bind(this)
    }

    //fetchUsers()

    searchUser(search){
        let myUsers = []
        firebase.firestore()
            .collection('users')
            .where('name','>=',search)
            .get()
            .then((infos)=>{
                infos.docs.map(doc => {
                    myUsers.push(doc/*data().name*/)
                })
                this.setState({userList: myUsers})
            })
    }
    
    
    render() {
        return (
            <View>
                <TextInput placeholder="Search User" onChangeText={(search)=>this.searchUser(search)}/>
                <FlatList
                    numColumns={1}
                    horizental={false}
                    data={this.state.userList}
                    renderItem={({item})=>(
                        <TouchableOpacity onPress={()=>/*props.navigation.navigate("Profile"*/console.log(item.id)}>
                            <Text>{item.data().name}</Text>
                        </TouchableOpacity>
                    )} />
            </View>
        )
    }
}

export default Search