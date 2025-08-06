import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

export default function NourishScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNourish = async () => {
      try {
        const res = await fetch('https://wellnesspurelife.com/api/news');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Error fetching nourish data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNourish();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    padding: 16,
    backgroundColor: '#fef8e7',
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
});
