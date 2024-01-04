import { View, Text } from 'react-native';
import React from 'react';

const BookDownloaded = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Book successfully saved check your downloads folder</Text>
    </View>
  );
};

export default BookDownloaded;
