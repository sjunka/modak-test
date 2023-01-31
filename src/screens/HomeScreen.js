import {View, SafeAreaView, StyleSheet, FlatList, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import useGaleryData from '../hooks/useGaleryData';
import CardWithImages from '../components/CardWithImages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
// import firebase from 'react-native-firebase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },

  flatlist: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  containerFavorites: {
    height: 400,
    marginTop: 20,
  },
});

const HomeScreen = ({navigation}) => {
  const URL = 'https://api.artic.edu/api/v1/artworks';

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const {data, loading} = useGaleryData(URL);

  const getFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('favorites');
      setFavorites(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (error) {
      console.log(error);
    }
  };

  const FavoritesPicker = ({name}) => {
    return (
      <View style={styles.containerFavorites}>
        <Button
          onPress={() => setProducts(favorites)}
          title={name}
          color="#841584"
        />
      </View>
    );
  };

  const PushNotificationComponent = ({name}) => {
    return (
      <View style={styles.containerFavorites}>
        <Button
          onPress={() => pushingNotification()}
          title={name}
          color="#841584"
        />
      </View>
    );
  };

  const pushingNotification = () => {
    PushNotification.localNotification({
      title: 'My Notification Title', // (optional)
      message: 'My Notification Message', // (required)
    });
  };

  useEffect(() => {
    if (data) {
      setProducts(data.data);
      getFavorites();
    }
  }, [data]);

  // useEffect(() => {
  //   // Check if app is in the foreground
  //   const notificationDisplayedListener = firebase
  //     .notifications()
  //     .onNotificationDisplayed(notification => {
  //       console.log('Notification displayed: ', notification);
  //     });

  //   // Check if user taps on the notification
  //   const notificationListener = firebase
  //     .notifications()
  //     .onNotification(notification => {
  //       console.log('Notification received: ', notification);
  //     });

  //   // Set up push notification channel (Android only)
  //   const channel = new firebase.notifications.Android.Channel(
  //     'test-channel',
  //     'Test Channel',
  //     firebase.notifications.Android.Importance.Max,
  //   ).setDescription('My test channel');
  //   firebase.notifications().android.createChannel(channel);

  //   // Schedule a notification
  //   const notification = new firebase.notifications.Notification()
  //     .setNotificationId('notificationId')
  //     .setTitle('Test Notification')
  //     .setBody('This is a test notification from Firebase.')
  //     .setData({
  //       key1: 'favorites',
  //       key2: 'workArt',
  //     })
  //     .android.setChannelId('test-channel')
  //     .android.setSmallIcon('ic_launcher')
  //     .android.setPriority(firebase.notifications.Android.Priority.Max);

  //   firebase.notifications().displayNotification(notification);

  //   return () => {
  //     notificationDisplayedListener();
  //     notificationListener();
  //   };
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', flexBasis: '10%'}}>
        <FavoritesPicker name={'favorites'} />
        <PushNotificationComponent name={'push notification'} />
      </View>
      <View style={{flexBasis: '90%'}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.flatlist}
          testID="flatlist"
          data={products}
          renderItem={({item}) => {
            return (
              <View>
                <CardWithImages
                  imageURL={item?.thumbnail?.lqip}
                  title={item?.title}
                  placeOfOrigin={item?.lace_of_origin}
                  id={item?.id}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </View>
            );
          }}
          keyExtractor={item =>
            item?.id?.toString() || Math.random().toString()
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
