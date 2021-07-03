import React, { Component } from 'react'
import {View, Button, Text} from 'react-native'

import firebase from 'firebase'

export class Home extends Component {
    
    constructor(props){
        super(props);
    }
    
    
    render() {
        return (
            <View>
                <Text>Welcome Home !</Text>                
                <Button title="Add Picture" onPress={()=> {this.props.navigation.navigate('addPicture')}}/>
            </View>
            )
    }
}

export default Home