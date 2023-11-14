import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  TextInput,
  FlatList,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [num, setNum] = useState('');
  const [display, setDisplay] = useState(0);
  const [posList, setPosList] = useState([]);
  const [negList, setNegList] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    getItems();
  }, []);

  const storeItem = async (pos, neg, val) => {
    try {
      let jsonKey = JSON.stringify(key);
      let jsonDis = JSON.stringify(val);
      if (pos !== null) {
        let jsonValue1 = JSON.stringify(pos);
        await AsyncStorage.setItem('posList', jsonValue1);
      }
      if (neg !== null) {
        let jsonValue2 = JSON.stringify(neg);
        await AsyncStorage.setItem('negList', jsonValue2);
      }
      await AsyncStorage.setItem('id', jsonKey);
      await AsyncStorage.setItem('display', jsonDis);
    } catch (e) {
      throw e;
    }
  };

  const getItems = async () => {
    let pos = await AsyncStorage.getItem('posList');
    let neg = await AsyncStorage.getItem('negList');
    let id = await AsyncStorage.getItem('id');
    let displayValue = await AsyncStorage.getItem('display');
    if (id !== null) {
      id = JSON.parse(id);
      setKey(id + 1);
    }

    if (neg !== null) {
      neg = JSON.parse(neg);
      setNegList(neg);
    }

    if (pos !== null) {
      pos = JSON.parse(pos);
      setPosList(pos);
    }

    if (displayValue !== null) {
      displayValue = JSON.parse(displayValue);
      setDisplay(displayValue);
    }
  };

  const addValue = () => {
    if (num) {
      let posData = [...posList];
      let negData = [...negList];
      let value = 0;
      if (isEnabled) {
        posData = [...posList, {val: num, key: key}];
        value = display + parseInt(num, 10);
        setKey(prev => parseInt(prev, 10) + 1);
        setPosList(posData);
        setDisplay(value);
        setNum('');
      } else {
        negData = [...negList, {val: num, key: key}];
        value = display - parseInt(num, 10);
        setKey(prev => parseInt(prev, 10) + 1);
        setNegList(negData);
        setDisplay(value);
        setNum('');
      }
      storeItem(posData, negData, value);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.text}>salary: {display}</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="eg: 1000"
          onChangeText={text => setNum(text)}
          value={num}
        />
        <View style={styles.switchView}>
          <Text>- </Text>
          <Switch
            onValueChange={() => setIsEnabled(prev => !prev)}
            value={isEnabled}
          />
          <Text>+</Text>
        </View>
        <Button color={'#666'} title="add" onPress={addValue} />
      </View>
      <View style={styles.lists}>
        <FlatList
          style={styles.list}
          data={posList}
          renderItem={({item}) => <Text style={styles.data}>+{item.val}</Text>}
        />
        <FlatList
          style={styles.list}
          data={negList}
          renderItem={({item}) => <Text style={styles.data}>-{item.val}</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  top: {
    backgroundColor: '#444',
    height: 300,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    padding: 10,
    gap: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 25,
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 10,
    padding: 5,
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  lists: {
    flexDirection: 'row',
    padding: 50,
    gap: 10,
  },
  list: {
    backgroundColor: '#444',
    padding: 10,
    height: 200,
    width: 100,
    borderRadius: 10,
  },
  data: {
    fontSize: 20,
    textAlign: 'left',
  },
});

export default App;
