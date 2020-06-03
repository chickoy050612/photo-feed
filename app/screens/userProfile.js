import * as React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';

import PhotoList from '../components/photoList.js';

class profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    checkParams = () => {
        var params = this.props.navigation.state.params;
        if (params){
            if(params.userId){
                this.setState({
                    userId: params.userId
                });
                this.fetchUserInfo(params.userId);
            }
        }
    }

    fetchUserInfo = (userId) => {
        //var data;
        var that = this;

        database.ref('users').child(userId).child('username').once('value').then(function(snapshot){
            const exists = (snapshot.val() !== null);
            if (exists) var data = snapshot.val();
                that.setState({username:data});
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('name').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) var data = snapshot.val();
            that.setState({ name: data });
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('avatar').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) var data = snapshot.val();
            that.setState({ avatar: data,
            loaded: true });
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('about').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) var data = snapshot.val();
            that.setState({
                about: data,
                loaded: true
            });
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('animalType').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) var data = snapshot.val();
            that.setState({
                animalType: data,
                loaded: true
            });
        }).catch(error => console.log(error));

        database.ref('users').child(userId).child('birthday').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) var data = snapshot.val();
            that.setState({
                birthday: data,
                loaded: true
            });
        }).catch(error => console.log(error));

    }

    componentDidMount = () => {
        this.checkParams();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                { this.state.loaded == false ? (
                    <View>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <View style={{flex: 1}}>
                        <View style={{ flexDirection:'row', height: 70, paddingTop: 30, backgroundColor: 'lightgrey', borderColor: 'gray', borderBottomWidth: 0.5, justifyContent: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity 
                                style={{width:100}}
                                onPress={()=> this.props.navigation.goBack()}>
                                <Text style={{fontSize:12, fontWeight: 'bold', paddingLeft: 10}}>Go Back</Text>
                            </TouchableOpacity>
                            <Text style={{fontSize:24, fontWeight: 'bold'}}>Profile</Text>
                            <Text style={{width:100}}></Text>
                        </View>
                        <View style={{justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row', paddingVertical: 10}}>
                            <Image source={{ uri: this.state.avatar }} style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50 }} />
                            <View style={{marginRight: 10}}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f54266' }}>Pets Name:</Text>
                                <Text style={{ fontSize: 16, color: '#0c4518' }}>{this.state.name}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f54266' }}>Owners Name:</Text>
                                <Text style={{ fontSize: 16, color: '#0c4518' }}>{this.state.username}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f54266' }}>Animal Type:</Text>
                                <Text style={{ fontSize: 16, color: '#0c4518' }}>{this.state.animalType}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f54266' }}>Birthday:</Text>
                                <Text style={{ fontSize: 16, color: '#0c4518' }}>{this.state.birthday}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f54266' }}>About:</Text>
                                <Text style={{ fontSize: 16, color: '#0c4518' }}>{this.state.about}</Text>
                            </View>
                        </View>

                        <PhotoList isUser={true} userId={this.state.userId} navigation={this.props.navigation} />
                        
                    </View>
                )}
            </View>
        )
    }


}


export default profile;