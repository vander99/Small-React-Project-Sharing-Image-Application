import React, {useState} from 'react';
import {View, TextInput, Image, Button, Text} from 'react-native';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function savePicture(props, navigation) {
    const [caption, setCaption] = useState("")
    const uploadImage = async() => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        console.log(childPath)

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob)

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                if (props.route.params.type == "newPost"){
                savePostData(snapshot)}
                else if (props.route.params.type == "updatePost"){
                    updateProfilePic(snapshot)
                }
                else {
                    console.log("chi haja mahiyach")
                }
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed",taskProgress, taskError, taskCompleted);
    }
    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                date: firebase.firestore.FieldValue.serverTimestamp(),
                username: props.route.params.username
            }).then((function() {
                props.navigation.navigate('Home')
            }))
    }

    const updateProfilePic = (downloadURL) => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .update({
                profilePic: downloadURL
            }).then((function() {
                props.navigation.navigate('Home')
            }))
    }
    return(
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}}/>
            {
            props.route.params.type == "newPost" ?
            <TextInput 
            placeholder="Write a Caption..."
            onChangeText={(caption)=>setCaption(caption)} />
            :
            <Text></Text>
        }
            <Button title="Save" onPress={()=> uploadImage()}></Button>
        </View>
        )
}