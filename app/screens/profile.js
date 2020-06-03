import * as React from 'react';
import { TextInput, TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';
import PhotoList from '../components/photoList.js';

import UserAuth from '../components/auth.js';

class profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        }
    }

    fetchUserInfo = (userId) => {

        var that = this;
        database.ref('users').child(userId).once('value').then(function(snapshot){
            const exists = (snapshot.val() !==  null);
            if (exists) var data = snapshot.val();
              that.setState({
                  username: data.username,
                  name: data.name,
                  avatar: data.avatar,
                  animalType: data.animalType,
                  birthday: data.birthday,
                  about: data.about,
                  loggedin: true,
                  userId: userId
              });
        });
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user){
            if (user){
                //logged in
                that.fetchUserInfo(user.uid);
                
            }else{
                //Not logged in
                that.setState({
                    loggedin: false
                });
            }
        });
    }

    saveProfile = () => {

        var name = this.state.name;
        var username = this.state.username;
        var birthday = this.state.birthday;
        var animalType = this.state.animalType;
        var about = this.state.about;

        if (name !== ''){
            database.ref('users').child(this.state.userId).child('name').set(name);
        }else{
            alert("Please provide the name...");
        }

        if (username !== '') {
            database.ref('users').child(this.state.userId).child('username').set(username);
        }
        else{
            alert("Please provide the Owners name...");
        }
        if (birthday !== '') {
            database.ref('users').child(this.state.userId).child('birthday').set(birthday);
        }else{
            alert("Please provide the birthday...");
        }
        if (animalType !== '') {
            database.ref('users').child(this.state.userId).child('animalType').set(animalType);
        }
        else{
            alert("Please provide the animal type...");
        }
        if (about !== '') {
            database.ref('users').child(this.state.userId).child('about').set(about);
        }
        else{
            alert("Provide something about your pet...");
        }
        this.setState({editingProfile: false});

    }

    logoutUser = () => {
        f.auth().signOut();
        alert('Logged Out')
    }

    editProfile = () => {
        this.setState({editingProfile: true})
    }


    render() {
        return (
          <View style={{ flex: 1 }}>
            {this.state.loggedin == true ? (
              //are logged in
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    height: 70,
                    paddingTop: 30,
                    backgroundColor: "lightgrey",
                    borderColor: "gray",
                    borderBottomWidth: 0.5,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text>Profile</Text>
                </View>
                <View
                  style={{
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingVertical: 10
                  }}
                >
                  <TouchableOpacity>
                    <Image
                      source={{ uri: this.state.avatar }}
                      style={{
                        marginLeft: 10,
                        width: 100,
                        height: 100,
                        borderRadius: 50
                      }}
                    />
                  </TouchableOpacity>
                  <View style={{ marginRight: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#f54266"
                        }}
                      >
                        Pets Name:
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#0c4518",
                          paddingLeft: 10
                        }}
                      >
                        {this.state.name}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#f54266"
                        }}
                      >
                        Owners Name:
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#0c4518",
                          paddingLeft: 10
                        }}
                      >
                        {this.state.username}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#f54266"
                        }}
                      >
                        Animal Type:
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#0c4518",
                          paddingLeft: 10
                        }}
                      >
                        {this.state.animalType}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#f54266"
                        }}
                      >
                        Birthday:
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#0c4518",
                          paddingLeft: 10
                        }}
                      >
                        {this.state.birthday}
                      </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#f54266"
                        }}
                      >
                        About:
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#0c4518",
                          paddingLeft: 10
                        }}
                      >
                        {this.state.about}
                      </Text>
                    </View>
                  </View>
                </View>
                {this.state.editingProfile == true ? (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingBottom: 20,
                      borderBottomWidth: 1
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          padding: 5,
                          marginVertical: 10,
                          fontWeight: "bold"
                        }}
                      >
                        Pets Name:
                      </Text>
                      <TextInput
                        editable={true}
                        placeholder={"Enter Your Pets Name"}
                        onChangeText={text => this.setState({ name: text })}
                        value={this.state.name}
                        style={{
                          width: 250,
                          marginVertical: 10,
                          padding: 5,
                          borderColor: "grey",
                          borderWidth: 1
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          padding: 5,
                          marginVertical: 10,
                          fontWeight: "bold"
                        }}
                      >
                        Owners Name:
                      </Text>
                      <TextInput
                        editable={true}
                        placeholder={"Enter Your New User Name"}
                        onChangeText={text => this.setState({ username: text })}
                        value={this.state.username}
                        style={{
                          width: 250,
                          marginVertical: 10,
                          padding: 5,
                          borderColor: "grey",
                          borderWidth: 1
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          padding: 5,
                          marginVertical: 10,
                          fontWeight: "bold"
                        }}
                      >
                        Animal Type:
                      </Text>
                      <TextInput
                        editable={true}
                        placeholder={"What type of animal is your pet"}
                        onChangeText={text =>
                          this.setState({ animalType: text })
                        }
                        value={this.state.animalType}
                        style={{
                          width: 250,
                          marginVertical: 10,
                          padding: 5,
                          borderColor: "grey",
                          borderWidth: 1
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          padding: 5,
                          marginVertical: 10,
                          fontWeight: "bold"
                        }}
                      >
                        Birthday:
                      </Text>
                      <TextInput
                        editable={true}
                        placeholder={"What is your pets birthday"}
                        onChangeText={text => this.setState({ birthday: text })}
                        value={this.state.birthday}
                        style={{
                          width: 250,
                          marginVertical: 10,
                          padding: 5,
                          borderColor: "grey",
                          borderWidth: 1
                        }}
                      />
                    </View>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          padding: 5,
                          marginVertical: 10,
                          fontWeight: "bold"
                        }}
                      >
                        About:
                      </Text>
                      <TextInput
                        editable={true}
                        placeholder={"Tell something about your pet..."}
                        onChangeText={text => this.setState({ about: text })}
                        value={this.state.about}
                        style={{
                          width: 250,
                          marginVertical: 10,
                          padding: 5,
                          borderColor: "grey",
                          borderWidth: 1
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#9adaed",
                          padding: 10,
                          marginRight: 5
                        }}
                        onPress={() => this.saveProfile()}
                      >
                        <Text style={{ fontWeight: "bold", color: "green" }}>
                          Save Changes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "red",
                          padding: 10,
                          marginLeft: 5
                        }}
                        onPress={() => this.setState({ editingProfile: false })}
                      >
                        <Text style={{ fontWeight: "bold", color: "white" }}>
                          Cancel Editing
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
                    <TouchableOpacity
                      onPress={() => this.logoutUser()}
                      style={{
                        backgroundColor: "grey",
                        marginTop: 10,
                        marginHorizontal: 40,
                        paddingVertical: 15,
                        borderRadius: 20,
                        borderColor: "grey",
                        borderWidth: 1.5
                      }}
                    >
                      <Text style={{ textAlign: "center", color: "white" }}>
                        Logout
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.editProfile()}
                      style={{
                        backgroundColor: "grey",
                        marginTop: 10,
                        marginHorizontal: 40,
                        paddingVertical: 15,
                        borderRadius: 20,
                        borderColor: "grey",
                        borderWidth: 1.5
                      }}
                    >
                      <Text style={{ textAlign: "center", color: "white" }}>
                        Edit Profile
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Upload")}
                      style={{
                        backgroundColor: "grey",
                        marginTop: 10,
                        marginHorizontal: 40,
                        paddingVertical: 15,
                        borderRadius: 20,
                        borderColor: "grey",
                        borderWidth: 1.5
                      }}
                    >
                      <Text style={{ textAlign: "center", color: "white" }}>
                        Upload New Photo
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <PhotoList
                  isUser={true}
                  userId={this.state.userId}
                  navigation={this.props.navigation}
                />
              </View>
            ) : (
              //not logged in
              <UserAuth message={"Please login to view your profile"} />
            )}
          </View>
        );
    }


}


export default profile;