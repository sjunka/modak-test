import React, {useState, useEffect} from 'react';
import {Text, Card} from 'react-native-paper';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGalleryDetails from '../hooks/useGalleryDetail';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  image: {
    alignSelf: 'center',

    margin: 20,

    width: 200,
    height: 200,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
  },
  modalSytles: {
    backgroundColor: 'teal',
    padding: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: 500,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pressableStyles: {
    marginTop: 20,
    backgroundColor: 'teal',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center',
    margin: 'auto',
  },
});

const CardWithImages = ({
  imageURL,
  title,
  placeOfOrigin,
  id,
  favorites,
  setFavorites,
}) => {
  const URL_DETAIL = `https://api.artic.edu/api/v1/artworks/${id}`;
  const [modalVisible, setModalVisible] = useState(false);
  const {data} = useGalleryDetails(URL_DETAIL);

  const saveFavorites = async savedFavorite => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(savedFavorite));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFavorite = newFavorite => {
    let spread = [...Object.values(newFavorite)];
    setFavorites([...spread, newFavorite]);
    saveFavorites([...spread, newFavorite]);
  };

  const DisplayModal = ({modalVisible, setModalVisible, dataDetail}) => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <FastImage
                style={styles.image}
                source={{
                  uri: dataDetail.thumbnail.lqip,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <Card.Title title={dataDetail.title} />
              <Card.Content>
                <Text>Artis: {dataDetail.artist_display}</Text>
                <Text>Location: {dataDetail.place_of_origin}</Text>
                <Text variant="bodySmall">
                  Dimensions: {dataDetail.dimensions}
                </Text>

                <Pressable
                  style={[
                    styles.button,
                    styles.buttonOpen,
                    styles.marginToppicker,
                  ]}
                  onPress={() => {
                    handleAddFavorite(dataDetail);
                  }}>
                  <Text style={styles.textStyle}>Agregar Favorito</Text>
                </Pressable>
              </Card.Content>

              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  styles.pressableStyles,
                ]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>VOLVER</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const toggleFavorite = artwork => {
    if (favorites.includes(artwork)) {
      setFavorites(favorites.filter(f => f !== artwork));
      saveFavorites(favorites.filter(f => f !== artwork));
    } else {
      setFavorites([...favorites, artwork]);
      saveFavorites([...favorites, artwork]);
    }
  };

  return (
    <>
      <TouchableWithoutFeedback
        testID="card-item"
        onPress={() => setModalVisible(!modalVisible)}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <FastImage
              style={styles.image}
              source={{
                uri: imageURL,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Card.Title title={title} />
            <Card.Content>
              <Text>{placeOfOrigin}</Text>
            </Card.Content>
          </Card>
        </View>
      </TouchableWithoutFeedback>
      {modalVisible && (
        <DisplayModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          dataDetail={data?.data}
        />
      )}
    </>
  );
};

export default CardWithImages;
