import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useGaleryData from '../hooks/useGaleryData';
import CardWithImages from '../components/CardWithImages';
import {Text} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [productMutable, setProductMutable] = useState([]);

  const {data, loading} = useGaleryData(URL);

  const getFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('favorites');

      setProducts(jsonValue != null ? JSON.parse(jsonValue) : null);

      // setProducts(productMutable);
    } catch (error) {
      console.log(error);
    }
  };

  const FavoritesPicker = () => {
    return (
      <View style={styles.containerFavorites}>
        <Button
          onPress={getFavorites}
          title="Favorites"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  };

  useEffect(() => {
    if (data) {
      setProducts(data.data);
      setProductMutable(data.data);
    }
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexBasis: '10%'}}>
        <FavoritesPicker />
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
                  imageURL={item.thumbnail.lqip}
                  title={item.title}
                  placeOfOrigin={item.lace_of_origin}
                  id={item.id}
                />
              </View>
            );
          }}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
