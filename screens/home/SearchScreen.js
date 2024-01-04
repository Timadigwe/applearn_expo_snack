import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { fetchBooks } from '../../utils/helpers';
import { Skeleton } from '@rneui/themed';
import { rh, rw } from '../../responsive';

const SearchScreen = ({ navigation, route }) => {
  const { searchQuery } = route.params;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch search results based on the query
  const fetchSearchResults = async () => {
    try {
      fetchBooks(searchQuery)
        .then((data) => {
          setSearchResults(data);
          setLoading(false);
        })
        .catch((error) => setLoading(false));
    } catch (error) {
      //console.error('Error fetching search results:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  // Function to navigate to the BookDetailScreen when a book is pressed
  const handleBookPress = (book) => {
    navigation.navigate('BookDetailScreen', { book });
  };

  // Render each search result item
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBookPress(item)}>
      <View style={styles.bookItem}>
        {!item.image ? (
          <Image
            source={require('../../assets/default.jpg')}
            style={styles.bookImage}
          />
        ) : (
          <Image
            source={{ uri: item.image }}
            style={styles.bookImage}
          />
        )}
        <Text style={styles.bookTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <Skeleton
            width={320}
            height={100}
            style={{ borderRadius: 8 }}
          />
          <Skeleton
            width={320}
            height={100}
            style={{ borderRadius: 8, marginTop: rh(10) }}
          />
          <Skeleton
            width={320}
            height={100}
            style={{ borderRadius: 8, marginTop: rh(10) }}
          />
          <Skeleton
            width={320}
            height={100}
            style={{ borderRadius: 8, marginTop: rh(10) }}
          />
          <Skeleton
            width={320}
            height={100}
            style={{ borderRadius: 8, marginTop: rh(10) }}
          />
          <Skeleton
            width={320}
            height={100}
            style={{ borderRadius: 8, marginTop: rh(10) }}
          />
        </>
      ) : searchResults.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Roboto_300Light',
              fontSize: 16,
              color: 'blue',
            }}>
            No results found for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookImage: {
    width: '20%',
    height: rh(80),
    marginRight: 16,
    borderRadius: 10,
  },
  bookTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    marginLeft: rw(10),
    width: rw(230),
  },
});

export default SearchScreen;
