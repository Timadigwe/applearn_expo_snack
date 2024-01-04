import { View, Text } from 'react-native';
import React from 'react';
import PDFReader from 'rn-pdf-reader-js';

const PdfViewer = ({ route }) => {
  const { source } = route.params;
  return (
    <PDFReader
      source={{
        uri: source,
      }}
    />
  );
};

export default PdfViewer;
