import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CApi from '../../lib/CApi';
import { useDispatch } from 'react-redux';

function ListAccount({ navigation }) {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 20 }}>List Of Account</Text>
        </View>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const body = {
        dataSource: 'Cluster0',
        database: 'puppet_uas',
        collection: 'account',
      };

      const { data } = await CApi.post('/action/find', body);
      if (data) {
        if (data.documents.length > 0) {
          // Reverse the order of data to display the latest items first
          setData(data.documents.reverse());
        } else {
          alert('No data found');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (searchInput === '') {
      fetchData();
      return;
    }
    try {
      const body = {
        dataSource: 'Cluster0',
        database: 'puppet_uas',
        collection: 'account',
        filter: {
          account_name: searchInput,
        },
      };

      const { data } = await CApi.post('/action/find', body);
      if (data) {
        if (data.documents.length > 0) {
          setData(data.documents.reverse());
        } else {
          alert('No data found');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={[styles.row, { alignItems: 'center', justifyContent: 'center', margin: 20 }]}>
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Search"
            value={searchInput}
            onChangeText={(text) => setSearchInput(text)}
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Render the fetched data */}
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.row,
              styles.itemContainer, // New style for the item container
            ]}
            onPress={() => navigation.navigate('Edit_Account', { id: item._id })}
          >
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.maintext}>{item.account_name}</Text>
              <Text style={styles.subtext}>{item.email}</Text>
              <View style={styles.row}>
                <Text style={[styles.subtext, { marginLeft: 5 }]}>{item.account_type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    width: 310,
    height: 40,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: '#ffffff',
  },
  maintext: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 20,
    marginTop: 5,
  },
  subtext: {
    fontSize: 15,
    marginLeft: 20,
    color: '#7a7979',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    margin: 20,
    marginTop: 5,
  },
});

export default ListAccount;
