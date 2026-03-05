import { View, Text, StyleSheet } from 'react-native';


export default function CardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CardScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});