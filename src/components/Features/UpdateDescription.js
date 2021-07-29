import React, { Component } from 'react'
import {View,Text, TextInput, Button} from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

export class UpdateDescription extends Component {
    
    constructor(props){
        super(props);
        this.state={
            newDescription:'',
        },
        this.saveDescription = this.saveDescription.bind(this)
    }

   saveDescription(){
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
                description: this.state.newDescription
            }).then(()=>{
                this.props.navigation.navigate('Home')
            })
    }

    /*componentDidMount(){
        firebase.firestore()
        .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((infos)=>{
                this.setState({userCaption:infos.data().description})
                this.setState({userImagePic:infos.data().profilePic})
                this.setState({username:infos.data().username})
                this.setState({loading:true})
            })
        }*/

    render() {
        return (
            <View>
                <TextInput placeholder="Update description" onChangeText={(newDescription) => this.setState({newDescription})}/>
                <Button title="Update" onPress={()=> {this.saveDescription()}}></Button>
            </View>
        )
    }
}

export default UpdateDescription