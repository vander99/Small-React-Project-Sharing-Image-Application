import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyB6vjr8RV9gmpS-F4B0G7OoI4GGsnCW9QA",
  authDomain: "instaclone-2e142.firebaseapp.com",
  projectId: "instaclone-2e142",
  storageBucket: "instaclone-2e142.appspot.com",
  messagingSenderId: "676835362291",
  appId: "1:676835362291:web:90755f241b722106b17e86",
  measurementId: "G-GM8X2TTHCX"
};
// Initialize Firebase
if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [uploading,setUploading] = useState(false);
  const [transferred,setTransferred] = useState(0);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null);
      console.log(data.uri)
      setImage(data.uri)
    }
  }  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  /*const submitPost = async () => {
    
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    setUploading(true);
    
    try {
      await storage().ref(filename).putFile(uploadUri);
      setUploading(false);
      Alert.alert('Image uploaded!');
    } catch(e) {
      console.log(e);
    }
  }*/


  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex: 1}}>
      <View style={styles.cameraContainer}>
        <Camera 
        ref={ref => setCamera(ref)}
        style={styles.fixedRatio} 
        type={type} 
        ratio={'1:1'}/>
      </View>

      <Button
        title= "flip image"
        onPress={() => {
        setType(
          type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
        );
        }}
      >
      </Button>
      <Button title="Take Picture" onPress={()=> takePicture()}></Button>
      <Button title="Pick Image From Gallery" onPress={()=> pickImage()}></Button>
      { image==null ?
        <View></View>
        :
        <Button title="Submit Post" onPress={()=> navigation.navigate("SavePicture",{image})} stle={{flex:1}}></Button>
      }
      {image && <Image source={{uri: image}} style={{flex: 1}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex:1,
    flexDirection: 'row'
  },
  fixRatio: {
    flex: 1,
    aspectRatio: 1
  }
})
