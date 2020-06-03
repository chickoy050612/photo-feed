import * as React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image} from 'react-native';
import { f, auth, database, storage } from '../../config/config.js';


class PhotoList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true,
            empty: false
        }
    }

    componentDidMount = () => {

        const { isUser, userId } = this.props;

        if (isUser == true){
            //Profile
            //userid
            this.loadFeed(userId);
        }else{
            this.loadFeed('');
        }

    }

    pluralCheck = (s) => {

        if (s == 1) {
            return ' ago';
        } else {
            return 's ago';
        }
    }

    timeConverter = (timestamp) => {

        var a = new Date(timestamp * 1000);
        var seconds = Math.floor((new Date() - a) / 1000);

        var interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' year' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' month' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' day' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hour' + this.pluralCheck(interval);
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minute' + this.pluralCheck(interval);
        }
        return Math.floor(seconds) + ' second' + this.pluralCheck(seconds);
    }

    addToFlatlist = (photo_feed, data, photo) => {
        var that = this;
        var photoObj = data[photo];
        //console.log("Test6" + JSON.stringify(data[photo]));
        database.ref('users').child(photoObj.author).child('username').once('value').then(function (snapshot) 
        {
            const exists = (snapshot.val() !== null);
            if (exists) var data = snapshot.val();
            var photo_feed = that.state.photo_feed;
            photo_feed.push({
                id: photo,
                url: photoObj.url,
                caption: photoObj.url,
                caption: photoObj.caption,
                posted: that.timeConverter(photoObj.posted),
                timestamp: photoObj.posted,
                //authors: JSON.stringify(userData),
                authorId: photoObj.author,
                author: data
            });
            
            //sort the photo feeds from latest to oldest base on the time posted
            var myData = [].concat(photo_feed).sort((a,b) => a.timestamp < b.timestamp);
            //console.log("test sort" + myData[0]);
            
            that.setState({
                refresh: false,
                loading: false,
                photo_feed: myData
            });

        }).catch(error => console.log(error));

    }

    loadFeed = (userId = '') => {

        this.setState({
            refresh: true,
            photo_feed: []
        });

        var that = this;

        var loadRef = database.ref('photos');
        if (userId != ''){
            loadRef = database.ref('users').child(userId).child('photos');
        }

        loadRef.orderByChild('posted').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null);
            if (exists) { var data = snapshot.val();
            var photo_feed = that.state.photo_feed;
            //console.log("Test 8: " + JSON.stringify(data));
            that.setState({ empty: false });
            for (var photo in data) {

                that.addToFlatlist(photo_feed, data, photo);
            }
          }else{
              that.setState({empty: true});
          }
        }).catch(error => console.log(error));

    }

    loadNew = () => {

        //Load feed
        this.loadFeed();
    }
    render()
    {
        return(
        <View style={{ flex: 1}}>
          { this.state.loading == true ? (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                { this.state.empty == true ? (
                    <Text>No Photos found...</Text>
                ) : ( 
                    <Text>Loading...</Text>
                )}                
            </View>
          ) : (
          <FlatList
            refreshing={this.state.refresh}
            onRefresh={this.loadNew}
            data={this.state.photo_feed}
            keyExtractor={(item, index) => index.toString()}
            style={{flex: 1, backgroundColor: '#eee'}}
            renderItem={({item, index}) => (
                <View key={index} style={{width: '100%', overflow:'hidden', marginBottom: 5, justifyContent: 'space-around', borderBottomWidth:1, borderColor: 'grey'}}>
                    <View style={{padding: 5, width:'100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text>{item.posted}</Text>
                        <TouchableOpacity
                            onPress={ () => this.props.navigation.navigate('User', {userId: item.authorId})}>
                            <Text>{item.author}</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Image
                            source={{ uri: item.url }}
                            style={{ resizeMode: 'cover', width: '100%', height:275 }}
                        />
                    </View>
                    <View style={{padding:5}}>
                        <Text>{item.caption}</Text>
                        <TouchableOpacity
                            onPress={ () => this.props.navigation.navigate('Comments', {photoId: item.id})}>
                            <Text style={{color: 'blue', marginTop: 10, textAlign:'center'}}>[ View Comments ]</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )} 
            />
          )}
        </View>
        )
    }


}

export default PhotoList;