import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { rh, rw } from '../../responsive';

const OfflineScreen = ({ navigation }) => {
  const [savedBooks, setSavedBooks] = useState([]);

  // Function to load and display saved books
  const loadSavedBooks = async () => {
    try {
      // Specify the directory where books are saved
      const directory = `${FileSystem.documentDirectory}books/`;

      // Read the contents of the directory
      const files = await FileSystem.readDirectoryAsync(directory);

      // Map each file name to its full path
      const filePaths = files.map((file) => `${directory}${file}`);

      // Read the content of each file
      const booksData = await Promise.all(
        filePaths.map(async (filePath) => {
          const content = await FileSystem.readAsStringAsync(filePath);
          return JSON.parse(content);
        })
      );

      // Update the state with the loaded books
      setSavedBooks(booksData);
    } catch (error) {
      //console.error('Error loading saved books:', error);
    }
  };

  // Use useFocusEffect to reload the saved books when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSavedBooks();
    }, [])
  );

  // Render each saved book item
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBookPress(item)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
        }}>
        {!item.image ? (
          <Image
            source={require('../../assets/default.jpg')}
            style={{ width: rw(100), height: rh(100), borderRadius: 10 }}
          />
        ) : (
          <Image
            source={{ uri: item.image }}
            style={{ width: rw(100), height: rh(100), borderRadius: 10 }}
          />
        )}
        <Text
          style={{
            fontFamily: 'Roboto_400Regular',
            fontSize: 14,
            marginLeft: rw(10),
            width: rw(230),
          }}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Function to handle book press
  const handleBookPress = (book) => {
    //console.log('content', book.content);
    if (book.content && book.content.type === 'pdf') {
      // Handle PDF format
      const pdfUrl = book.content.uri;
      const source = { uri: pdfUrl };
      navigation.navigate('PdfViewer', { source });
    } else if (book.content && book.content.type === 'html') {
      // Handle HTML format
      const htmlContent = book.content.content;
      navigation.navigate('HtmlViewer', { content: htmlContent });
    } else {
      // Handle the case when no supported format is found
      Alert.alert('Error', 'No supported format found for reading');
    }
  };

  if (savedBooks.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: 'Roboto_300Light',
            fontSize: 16,
            color: 'blue',
          }}>
          No books have been saved.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 60 }}>
      <Text
        style={{ fontFamily: 'Roboto_500Medium', fontSize: 20, padding: 16 }}>
        Saved Books
      </Text>
      <FlatList
        data={savedBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal={false}
      />
    </View>
  );
};

export default OfflineScreen;
