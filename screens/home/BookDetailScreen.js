import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rh, rw } from '../../responsive';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';

const downloadAndOpenPDF = async (pdfUrl, fileName) => {
  try {
    // Check if the Downloads directory exists, if not, create it
    const downloadsDir = FileSystem.documentDirectory + 'Download';
    const downloadsDirInfo = await FileSystem.getInfoAsync(downloadsDir);

    if (!downloadsDirInfo.exists || !downloadsDirInfo.isDirectory) {
      await FileSystem.makeDirectoryAsync(downloadsDir, {
        intermediates: true,
      });
    }

    // Create a download resumable
    const downloadResumable = FileSystem.createDownloadResumable(
      pdfUrl,
      downloadsDir + '/' + fileName
    );

    const { uri } = await downloadResumable.downloadAsync();

    console.log('File downloaded to:', uri);

    // Use IntentLauncher to open the PDF
    FileSystem.getContentUriAsync(uri).then((cUri) => {
      if (Platform.OS === 'ios') {
        Sharing.shareAsync(cUri.uri);
      } else {
        if (Platform.OS === 'android') {
          IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            data: cUri.uri,
            flags: 1,
            type: 'application/pdf',
          });
        }
      }
    });

    return uri;
  } catch (error) {
    console.error('Error downloading or opening PDF:', error);
  }
};

const BookDetailScreen = ({ route }) => {
  const { book } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const navigation = useNavigation();

  console.log('books param', book);

  const handleReadBook = async () => {
    try {
      setIsLoading(true); // Set loading state to true

      if (Platform.OS == 'web') {
        await WebBrowser.openBrowserAsync(book.formats['text/html']);
      } else {
        if (book.formats && book.formats['application/pdf']) {
          // Handle PDF format
          const pdfUrl = book.formats['application/pdf'];
          navigation.navigate('PdfViewer', { source: pdfUrl });
        } else if (book.formats && book.formats['text/html']) {
          // Handle HTML format
          const htmlUrl = book.formats['text/html'];

          navigation.navigate('WebViewer', { source: htmlUrl });
        } else {
          // Handle the case when neither PDF nor text format is available
          Alert.alert('Error', 'No supported format found for reading');
        }
      }
    } catch (error) {
      console.error('Error opening book:', error);
      Alert.alert('Error', 'Could not open the book');
    } finally {
      setIsLoading(false); // Set loading state to false after completion
    }
  };

  const handleSaveForLater = async () => {
    setIsLoading2(true);
    try {
      if (book.formats && book.formats['application/pdf']) {
        const pdfUrl = book.formats['application/pdf'];
        setIsLoading2(false);
        navigation.navigate('WebViewer', { source: pdfUrl });
      } else if (book.formats && book.formats['application/octet-stream']) {
        // Handle HTML format
        const url = book.formats['application/octet-stream'];

        setIsLoading2(false);
        navigation.navigate('WebViewer', { source: url });
      } else {
        // Handle the case when neither PDF nor text format is available
        Alert.alert('Error', 'No supported format found for download');
        setIsLoading2(false);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      setIsLoading2(false);
      throw error;
    } finally {
      setIsLoading(false); // Set loading state to false after completion
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <FontAwesome
              name="arrow-left"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Book Details</Text>
        </View>
        <View style={styles.imageContainer}>
          {!book.image ? (
            <Image
              source={require('../../assets/default.jpg')}
              style={styles.bookImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={{ uri: book.image }}
              style={styles.bookImage}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.bookDetails}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.authors}>
            {book.authors.map((author) => author.name).join(', ')}
          </Text>
          <Text style={styles.downloadCount}>
            Downloads: {book.downloadCount}
          </Text>
          <Text style={styles.languages}>
            Languages: {book.languages.join(', ')}
          </Text>
          <Text style={styles.subjects}>
            Subjects: {book.subjects.join(', ')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.readButton}
          onPress={handleReadBook}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
            />
          ) : (
            <Text style={styles.readButtonText}>Read Book</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.previewButton}
          onPress={handleSaveForLater}>
          {isLoading2 ? (
            <ActivityIndicator
              size="small"
              color="#fff"
            />
          ) : (
            <Text
              style={styles.previewButtonText}
              disabled={isLoading2}>
              Save for later
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 50,
  },
  backButton: {
    marginLeft: 10,
  },
  imageContainer: {
    height: rh(230),
    overflow: 'hidden',
    margin: 10,
    borderRadius: 20,
  },
  bookImage: {
    flex: 1,
  },
  readButton: {
    backgroundColor: '#6997FF',
    padding: 15,
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  readButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookDetails: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212330',
    marginBottom: rh(10),
  },
  authors: {
    fontSize: 18,
    color: '#373F78',
    marginBottom: rh(10),
  },
  downloadCount: {
    fontSize: 16,
    color: '#373F78',
    marginBottom: rh(10),
  },
  languages: {
    fontSize: 16,
    color: '#373F78',
    marginBottom: rh(10),
  },
  subjects: {
    fontSize: 16,
    color: '#373F78',
    marginBottom: rh(10),
  },
});

export default BookDetailScreen;
