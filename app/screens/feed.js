import * as React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

import PhotoList from '../components/photoList.js';

class feed extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true
        }
    }
    // componentDidMount = () => {
        
    // }

    render()
    {
        return(
        <View style={{ flex: 1}}>

                <View style={{ height: 120, paddingTop: 30, backgroundColor: '#f54266', borderColor: 'gray', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 30, color: 'white'}}>Pet Social</Text>
          </View>
                <PhotoList isUser={false} navigation={this.props.navigation} />
        </View>
        )
    }
            
}
        
        
export default feed;