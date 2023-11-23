import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, StatusBar, StyleSheet, Text, Button, View } from 'react-native';
import React, { useEffect, useState } from 'react';

const HomeScreen = () => {
  const [jokeData, setJokeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    Programming: false,
    Miscellaneous: false,
    Dark: false,
    Pun: false,
    Spooky: false,
    Christmas: false,
  });

  const handleToggle = (checkboxName) => {
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [checkboxName]: !prevCheckboxes[checkboxName],
    }));
  };

  const CheckBox = ({ checkboxName }) => {
    return (
      <TouchableOpacity onPress={() => handleToggle(checkboxName)} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checkboxes[checkboxName] && styles.checked]}></View>
        <Text style={{ marginLeft: 5 }}>{checkboxName}</Text>
      </TouchableOpacity>
    );
  };

  const getSelectedCategories = () => {
    return Object.keys(checkboxes).filter((checkbox) => checkboxes[checkbox]);
  };

  const getJoke = async () => {
    try {
      setLoading(true);

      const selectedCategories = getSelectedCategories();
      const apiUrl =
        selectedCategories.length > 0
          ? `https://v2.jokeapi.dev/joke/${selectedCategories.join(',')}`
          : 'https://v2.jokeapi.dev/joke/Any';

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.type === 'twopart') {
        setJokeData(`${data.setup} ${data.delivery}`);
      } else {
        setJokeData(data.joke);
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.checkboxRow}>
          <CheckBox checkboxName="Programming" />
          <CheckBox checkboxName="Miscellaneous" />
          <CheckBox checkboxName="Dark" />
        </View>
        <View style={styles.checkboxRow}>
          <CheckBox checkboxName="Pun" />
          <CheckBox checkboxName="Spooky" />
          <CheckBox checkboxName="Christmas" />
        </View>

        <View style={styles.jokeContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={{ fontFamily: 'CarterOne-Regular', fontSize: 20 }}>{jokeData}</Text>
          )}
        </View>
        
        <View style={{ marginTop: 5, borderRadius: 20 }}>
          <Button title="Get Joke" onPress={getJoke} color="#5800FF" />
        </View>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#183D3D',
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
    marginRight: 2,
  },
  checked: {
    backgroundColor: '#D2DE32',
  },
  jokeContainer: {
    backgroundColor: 'pink',
    height: 200,
    width: '80%',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

export default HomeScreen;
