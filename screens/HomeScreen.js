import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const API_KEY = '38c06c561698401c9d1ed25447e9c209';

const NEWS_URL =
  `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${API_KEY}`;

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(NEWS_URL)
      .then(res => res.json())
      .then(data => {
        setNews(data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      {item.urlToImage ? (
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={{ color: '#888' }}>No Image</Text>
        </View>
      )}

      <View style={styles.textBox}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'ไม่มีคำอธิบาย'}
        </Text>
      </View>

    </View>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.header}>News</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6600" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9'
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3
  },

  image: {
    width: '100%',
    height: screenWidth * 0.5,
    backgroundColor: '#ddd'
  },

  noImage: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  textBox: {
    padding: 12
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },

  description: {
    fontSize: 14,
    color: '#555'
  }

});