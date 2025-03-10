import * as React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image, TextInput, ActivityIndicator } from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';


import UserAuth from '../components/auth.js';

class upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            imageId: this.uniqueId(),
            imageSelected: false,
            uploading:false,
            caption: '',
            progress: 0
        }
    }

    _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({camera:status});

        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({cameraRoll:status});
    }


    s4 = () => {
        return Math.random().toString(36).substring(7);
    }

    //creating a unique id for imageId
    uniqueId = () => {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    findNewImage = async () => {
        this._checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result);

        if(!result.cancelled){

            console.log('upload image');
            this.setState({
            imageSelected: true,
            imageId: this.uniqueId(),
            uri: result.uri
        });

        }else{
            console.log('canceled');
            this.setState({
            imageSelected: false
            });
        }
    };

    uploadPublish = () => {
        if (this.state.uploading == false) {
          if (this.state.caption != "") {
              //
              this.uploadImage(this.state.uri);
          } else {
              alert("Please enter a caption..");
          }
        } else {
        console.log("Ignore button tap as already uploading");
        }
    };

    uploadImage = async (uri) => {
        //
        var that = this;
        var userid = f.auth().currentUser.uid;
        var imageId = this.state.imageId;

        //check the sequence of the character of the string
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];
        this.setState({
        currentFileType: ext,
        uploading: true
    });

        /*const response = await fetch(uri);
        const blob = await response.blob();*/
        var FilePath = imageId + "." + that.state.currentFileType;
 
        const oReq = new XMLHttpRequest();
        oReq.open("GET", uri, true);
        oReq.responseType = "blob";
        oReq.onload = () => {
            const blob = oReq.response;
            //Call function to complete upload with the new blob to handle the uploadTask.
            this.completeUploadBlob(blob, FilePath);
            };
        oReq.send();
    };

    completeUploadBlob = (blob, FilePath) => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;
 
    var uploadTask = storage
      .ref("user/" + userid + "/img")
      .child(FilePath)
      .put(blob);
 
    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      },
      function(error) {
        console.log("error with upload - " + error);
      },
      function() {
        //complete
        that.setState({ progress: 100 });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
        });
      }
    );
  };
 
  processUpload = (imageUrl) => {
    //Process here...
 
    //Set needed info
    var imageId = this.state.imageId;
    var userId = f.auth().currentUser.uid;
    var caption = this.state.caption;
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);
    //Build photo object
    //author, caption, posted, url
 
    var photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    };
 
    //Update database
 
    //Add to main feed
    database.ref("/photos/" + imageId).set(photoObj);
 
    //Set user photos object
    database.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);
 
    alert("Image Uploaded!!");
 
    this.setState({
      uploading: false,
      imageSelected: false,
      caption: "",
      uri: ""
    });
  };

    componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        //Logged in
        that.setState({
          loggedin: true
        });
      } else {
        that.setState({
          loggedin: false
        });
      }
    });
  };
 
  render() {
    return (
    <View style={{ flex: 1 }}>
        {this.state.loggedin == true ? (
          //are logged in
        <View style={{ flex: 1 }}>
          {this.state.imageSelected == true ? (
          <View style={{flex: 1}}>
            <View style={{
              height: 70,
              paddingTop: 30,
              backgroundColor: "white",
              borderColor: "lightgrey",
              borderBottomWidth: 0.5,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>Upload</Text>
          </View>
          <View style={{ padding: 5 }}>
            <Text style={{ marginTop: 5 }}>Caption:</Text>
            <TextInput
              editable={true}
              placeholder={"Enter your caption"}
              maxLength={150}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => this.setState({ caption: text })}
              style={{
                marginVertical: 10,
                height: 100,
                padding: 5,
                borderColor: "grey",
                borderWidth: 1,
                borderRadius: 3,
                backgroundColor: "white",
                color: "black"
              }}
            />

            <TouchableOpacity
              onPress={() => this.uploadPublish()}
              style={{
                alignSelf: "center",
                width: 170,
                marginHorizontal: "auto",
                backgroundColor: "purple",
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                Upload & Publish
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => this.setState({imageSelected: false})}
              style={{
              alignSelf: "center",
              width: 170,
              marginHorizontal: "auto",
              backgroundColor: "#cc1b3b",
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginTop: 10
              }}
              >
              <Text style={{ textAlign: "center", color: "white" }}>
                Cancel
              </Text>
                  </TouchableOpacity>


            {this.state.uploading == true ? (
              <View style={{ marginTop: 10 }}>
                <Text>{this.state.progress}%</Text>
                {this.state.progress != 100 ? (
                  <ActivityIndicator size="small" color="blue" />
                  ) : (
                  <Text>Processing</Text>
                )}
            </View>
            ) : (
             <View />
        )}

        <Image
          source={{ uri: this.state.uri }}
          style={{
            marginTop: 10,
            resizeMode: "cover",
            width: "100%",
            height: 275
          }}
        />
      </View>
      </View>
    ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload</Text>
      <TouchableOpacity
        onPress={() => this.findNewImage()}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: "#9adaed",
          borderRadius: 5
        }}
      >
        <Text style={{ color: "white"}}>Select Photo</Text>
      </TouchableOpacity>
    </View>
  )}
  </View>
      ) : (
        <UserAuth message={"Please login to upload a photo"} /> 
      )}
  </View>
  );
 }
}

export default upload;