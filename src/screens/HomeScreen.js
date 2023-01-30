import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useGaleryData from '../hooks/useGaleryData';
import CardWithImages from '../components/CardWithImages';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    margin: 15,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'salmon',
  },

  flatlist: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

const HomeScreen = ({navigation}) => {
  const URL = 'https://api.artic.edu/api/v1/artworks';

  const [products, setProducts] = useState([]);

  const [productMutable, setProductMutable] = useState([]);

  const {data, loading} = useGaleryData(URL);

  useEffect(() => {
    if (data) {
      setProducts(data.data);
      setProductMutable(data.data);
    }
  }, [data]);

  //   useEffect(() => {
  //     const total = getTotalPoints(productMutable);
  //     setTotalPoints(total);
  //   }, [productMutable]);

  //   useEffect(() => {
  //     setProducts(products);
  //   }, [products]);

  // if (loading) {
  //     return (
  //         <SafeAreaView style={styles.loaderContainer}>
  //             <Text style={styles.text}>Cargando tus puntos...</Text>
  //         </SafeAreaView>
  //     );
  // }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionTop}>
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
