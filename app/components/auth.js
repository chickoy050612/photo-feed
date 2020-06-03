import React from 'react';
import { TouchableOpacity, TextInput, KeyboardAvoidingView, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';
import * as Facebook from "expo-facebook";

class UserAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authStep: 0,
      email: "",
      pass: "",
      moveScreen: false,
    };
  }

  //login current user
  login = async () => {
    var email = this.state.email;
    var pass = this.state.pass;

    if (email != "" && pass != "") {
      try {
        let user = await auth.signInWithEmailAndPassword(email, pass); //'test2@gmail.com', '123456'
      } catch (error) {
        console.log(error);
        alert(error);
      }
    } else {
      alert("Please provide email and password to login...");
    }
  };

  //register new user
  createUserObj = (userObj, email) => {

    var uObj = {
      name: "Enter Name",
      username: "@name",
      avatar: "http://www.gravatar.com/avatar",
      email: email
    };
    database
      .ref("users")
      .child(userObj.uid)
      .set(uObj);
    alert("Congratulations! You Just Sign up in PetSocial!");
  };

  signup = async () => {
    var email = this.state.email;
    var pass = this.state.pass;

    if (email != "" && pass != "") {
      try {
        let user = await auth
          .createUserWithEmailAndPassword(email, pass)
          .then(userObj => this.createUserObj(userObj.user, email))
          .catch(error => alert(error));
      } catch (error) {
        console.log(error);
        alert(error);
      }
    } else {
      alert("Please provide email and password to login...");
    }
  };

  loginWithFacebook = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      '221446215668589',
      { permissions: ['public_profile', 'email'] }
    );

    if (type === 'success') {
      const credentials = f.auth.FacebookAuthProvider.credential(token);
      const response = await f.auth().signInWithCredential(credentials).catch((error) => {
        console.log('Error...', error);
      })
      //const fbObj = await database.ref('users').child('userId').get();
      // console.log ('test new', fbObj);
      // if (!fbObj.exists){
        
      // }else{
      var userId = f.auth().currentUser.uid;
      if (userId != response.user.uid){
        const fbUser = {
          uid: response.user.uid,
          avatar: response.user.photoURL,
          username: response.user.displayName,
        }
        database.ref('users').child(response.user.uid).set(fbUser);

      }
      

    }

  };

  componentDidMount = () => {
    if (this.props.moveScreen == true) {
      this.setState({ moveScreen: true });
    }
    // f.auth().onAuthStateChanged((user) => {
    //   if (user != null) {
    //     if (this.state.moveScreen == true) {
    //       this.props.navigation.navigate("Upload");
    //       return true;
    //     }
    //     //this.setState({ authStep: 0 });
    //     console.log(user);
    //     console.log("3=========================================================");
    //     console.log("DISPLAY NAME", user.displayName);
    //     var fbObj = {
    //       userId: user.uid,
    //       name: user.displayName,
    //       avatar: user.photoURL
    //     }
    //     console.log('test4=============');
    //     console.log(fbObj);
    //     database.ref('users').child("userId").set(fbObj);
    //   }

    // })
    
  };

  showLogin = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 1 });
  };

  showSignup = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 2 });
  };

  //temporary logout until facebook log in is done
  logoutUser = () => {
    f.auth().signOut();
    alert('Logged Out')
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 20, color: "#cc1b3b" }}>
          You are not logged in!
        </Text>
        <Text style={{ fontSize: 20, color: "#cc1b3b" }}>
          {this.props.message}
        </Text>
        {this.state.authStep == 0 ? (
          <View style={{ alignContent: 'center', marginVertical: 30 }}>
            <TouchableOpacity onPress={() => this.showLogin()}>
              <Text
                style={{ fontWeight: "bold", color: "#3cc260", fontSize: 20, textAlign: 'center' }}
              >
                Login
              </Text>
            </TouchableOpacity>

            <Text style={{ marginHorizontal: 10, fontSize: 20, textAlign: 'center' }}>Or</Text>

            <TouchableOpacity onPress={() => this.showSignup()}>
              <Text style={{ fontWeight: "bold", color: "#1b2d54", fontSize: 20, textAlign: 'center' }}>Sign Up</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => this.logoutUser()}>
              <Text>logout</Text>
            </TouchableOpacity> */}

          </View>
        ) : (
          <View style={{ marginVertical: 20 }}>
            {this.state.authStep == 1 ? (
              //Login
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "black"
                  }}
                >
                  Login
                </Text>
                <Text>Email Address:</Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder={"enter your email address..."}
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderWidth: 1,
                    borderColor: "#1a202e",
                    borderRadius: 5
                  }}
                />
                <Text>Password:</Text>
                <TextInput
                  editable={true}
                  secureTextEntry={true}
                  placeholder={"enter your password..."}
                  onChangeText={text => this.setState({ pass: text })}
                  value={this.state.pass}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderWidth: 1,
                    borderColor: "#1a202e",
                    borderRadius: 5
                  }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3cc260",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 7,
                    marginBottom: 15
                  }}
                  onPress={() => this.login()}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={{
                    backgroundColor: "#cc1b3b",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 7
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                  <TouchableHighlight
                    onPress={() => this.loginWithFacebook()}
                    style={{ backgroundColor: "#2375e8", marginTop: 30, padding: 10, borderRadius: 5 }}
                  >
                    <Text style={{ color: "white", fontSize: 20, textAlign: 'center' }}>Login with Facebook</Text>
                  </TouchableHighlight>

              </View>
            ) : (
              //sign up
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "black"
                  }}
                >
                  Sign Up
                </Text>
                <Text>Email Address:</Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder={"enter your email address..."}
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderWidth: 1,
                    borderColor: "#1a202e",
                    borderRadius: 5
                  }}
                />
                <Text>Password:</Text>
                <TextInput
                  editable={true}
                  secureTextEntry={true}
                  placeholder={"enter your password..."}
                  onChangeText={text => this.setState({ pass: text })}
                  value={this.state.pass}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderWidth: 1,
                    borderColor: "#1a202e",
                    borderRadius: 5
                  }}
                />

                <TouchableOpacity
                  style={{
                    backgroundColor: "#1b2d54",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 7,
                    marginBottom: 15
                  }}
                  onPress={() => this.signup()}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={{
                    backgroundColor: "#cc1b3b",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 7
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}


export default UserAuth;