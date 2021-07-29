import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import firebase from'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyB6vjr8RV9gmpS-F4B0G7OoI4GGsnCW9QA",
  authDomain: "instaclone-2e142.firebaseapp.com",
  projectId: "instaclone-2e142",
  storageBucket: "instaclone-2e142.appspot.com",
  messagingSenderId: "676835362291",
  appId: "1:676835362291:web:90755f241b722106b17e86",
  measurementId: "G-GM8X2TTHCX"
};

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Logout from './components/auth/Logout'
import Home from './components/Main/Home'
import homePage from './components/Main/homePage'
import friendPage from './components/Main/friendPage'
import addPicture from './components/Pictures/addPicture'
import savePicture from './components/Pictures/savePicture'
import searchBar from './components/Features/searchBar'
import Update from './components/Features/Update'
import UpdateDescription from './components/Features/UpdateDescription'

const Stack = createStackNavigator();

export class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            loaded: false
        }
    }
    
    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) =>{
            if(!user){
                this.setState({
                    loggedIn: false,
                    loaded: true
                })
            }
            this.setState({
                    loggedIn: true,
                    loaded: true
                })
        })    
    }
    
    render() {
        const { loggedIn, loaded } = this.state;
        if (!loaded){
            return(
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text>Loading</Text>
                </View>
                );
        }
        return (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Login">
                        <Stack.Screen name="Register" component={Register} options={ {headerShown: false}}/>
                        <Stack.Screen name="Login" component={Login} options={ {headerShown: false}}/>
                        <Stack.Screen name="Home" component={Home} options={ {headerShown: false}}/>
                        <Stack.Screen name="addPicture" component={addPicture} options={ {headerShown: false}} navigation={this.props.navigation}/>
                        <Stack.Screen name="savePicture" component={savePicture} options={ {headerShown: false}} navigation={this.props.navigation} />
                        <Stack.Screen name="Logout" component={Logout} options={ {headerShown: false}} navigation={this.props.navigation} />
                        <Stack.Screen name="homePage" component={homePage} options={ {headerShown: false}}/>
                        <Stack.Screen name="friendPage" component={friendPage} options={ {headerShown: false}}/>
                        <Stack.Screen name="searchBar" component={searchBar} options={ {headerShown: false}}/>
                        <Stack.Screen name="Update" component={Update} />
                        <Stack.Screen name="UpdateDescription" component={UpdateDescription} />
                    </Stack.Navigator>
                </NavigationContainer>
        );
    }
}
 
/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/

export default App
