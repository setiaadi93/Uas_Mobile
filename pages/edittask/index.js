import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../components';
import CApi from '../../lib/CApi';
import { useDispatch } from 'react-redux';
import { clearTask } from '../../store/reducer/taskSlice';

function EditListTask({ navigation, route }) {
  const task = useSelector((state) => state.task);
  const [idacc, setIdacc] = useState('');
  const [type, setType] = useState('');
  const [email, setEmail] = useState('');
  const [initial_id, setInitialId] = useState('');
  const [initial_page, setInittialPage] = useState('');
  const [counter, setCounter] = useState('');
  const [userid, setId] = useState('');
  const { id } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    FindData();
    if (route.params && route.params.id) {
      setIdacc(route.params.id);
      fectdata();
    }
  }, [navigation, route.params, dispatch]);

  const fectdata = async () => {
    try {
      const body = {
        dataSource: 'Cluster0',
        database: 'puppet_uas',
        collection: 'account',
        filter: {
          "_id": { "$oid": route.params.id }
        }
      };

      const { data } = await CApi.post('/action/find', body);
      if (data) {
        if (data.documents.length > 0) {
          setEmail(data.documents[0].email);
          setType(data.documents[0].account_type);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const FindData = async () => {
    try {
      const body = {
        dataSource: 'Cluster0',
        database: 'puppet_uas',
        collection: 'task',
        filter: {
          "_id": { "$oid": id }
        }
      };

      const { data } = await CApi.post('/action/find', body);
      if (data) {
        if (data.documents.length > 0) {
          console.log(data.documents);
          setId(id);
          setType(data.documents[0].account_type);
          setIdacc(data.documents[0].account_id);
          setEmail(data.documents[0].email);
          setInitialId(data.documents[0].initial_id);
          setInittialPage(data.documents[0].initial_page);
          setCounter(data.documents[0].counter);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [isLoadingU, setLoadingU] = useState(false);
  const [isLoadingD, setLoadingD] = useState(false);

  const submitTask = async () => {
    if (type === '' || initial_id === '' || initial_page === '' || counter === '') {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setLoadingU(true);
      const body = {
        "dataSource": "Cluster0",
        "database": "puppet_uas",
        "collection": "task",
        "filter": { "_id": { "$oid": userid } },
        "update": {
          "$set": {
            "account_id": idacc,
            "account_type": type,
            "email": email,
            "initial_id": initial_id,
            "initial_page": initial_page,
            "counter": counter,
          }
        }
      };
      const res = await CApi.post('/action/updateOne', body);
      setLoadingU(false);
      if (parseInt(res.data.modifiedCount) > 0) {
        setType(type);
        setIdacc(idacc);
        setInitialId(initial_id);
        setInittialPage(initial_page);
        setCounter(counter);
        setEmail(email);
      }
      Alert.alert('Success', 'Data berhasil diupdate', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('List_task');
          },
        },
      ]);

    } catch (error) {
      setLoadingU(false);
      console.error(error);
    }
  };

  const deleteTask = async () => {
    try {
      setLoadingD(true);
      const body = {
        "dataSource": "Cluster0",
        "database": "puppet_uas",
        "collection": "task",
        "filter": { "_id": { "$oid": userid } }
      };
      const res = await CApi.post('/action/deleteOne', body);
      setLoadingD(false);
      if (parseInt(res.data.deletedCount) > 0) {
        dispatch(clearTask());
        navigation.navigate('List_task');
      }
      Alert.alert('Success', 'Data berhasil dihapus', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('List_task');
          },
        },
      ]);
    } catch (error) {
      setLoadingD(false);
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={[style.container]}>
          <View style={[style.row]}>
            <View>
              <Text style={style.Text}>Select Account</Text>
            </View>
          </View>
          <View style={[style.row]}>
            <TextInput
              style={[style.input, { marginTop: 10, width: 200, backgroundColor: '#f0eded' }]}
              value={idacc}
              onChangeText={(text) => setIdacc(text)}
              placeholder="Account Type"
              editable={false}
            />
            <PrimaryButton
              style={{ marginLeft: 10, marginTop: 10, backgroundColor: '#fca503', width: 100 }}
              onPress={() => navigation.navigate('Edit_Select_Task')}
              title="Select"
            />
          </View>
          <View style={[style.row, { marginTop: 15, display: 'none' }]}>
            <View>
              <Text style={style.Text}>Task Id</Text>
              <TextInput
                style={[style.input, { marginTop: 10 }]}
                value={userid}
                onChangeText={(text) => setId(text)}
                placeholder="Input Id"
                editable={false} />
            </View>
          </View>
          <View style={[style.row, { marginTop: 15 }]}>
            <View>
              <Text style={style.Text}>Account Type</Text>
              <TextInput
                style={[style.input, { marginTop: 10, backgroundColor: '#f0eded' }]}
                value={type}
                onChangeText={(text) => setType(text)}
                placeholder="Input Account Type"
                editable={false} />
            </View>
          </View>
          <View style={[style.row, { marginTop: 15 }]}>
            <View>
              <Text style={style.Text}>Email</Text>
              <TextInput
                style={[style.input, { marginTop: 10, backgroundColor: '#f0eded' }]}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Input Email"
                editable={false} />
            </View>
          </View>
          <View style={[style.row, { marginTop: 15 }]}>
            <View>
              <Text style={style.Text}>Initial Id</Text>
              <TextInput
                style={[style.input, { marginTop: 10 }]}
                value={initial_id}
                onChangeText={(text) => setInitialId(text)}
                placeholder="Input Initial id" />
            </View>
          </View>
          <View style={[style.row, { marginTop: 15 }]}>
            <View>
              <Text style={style.Text}>Initial Page</Text>
              <TextInput
                style={[style.input, { marginTop: 10 }]}
                value={initial_page}
                onChangeText={(text) => setInittialPage(text)}
                placeholder="Input Initial Page" />
            </View>
          </View>
          <View style={[style.row, { marginTop: 15 }]}>
            <View>
              <Text style={style.Text}>Counter</Text>
              <TextInput
                style={[style.input, { marginTop: 10 }]}
                value={counter}
                onChangeText={(text) => setCounter(text)}
                placeholder="Input Counter" />
            </View>
          </View>

          <PrimaryButton
            style={{ marginTop: 40, backgroundColor: '#fca503' }}
            title="Update Data"
            onPress={submitTask}
          />

          <TouchableOpacity
            style={{ marginTop: 20, backgroundColor: 'red', padding: 10, borderRadius: 8, alignItems: 'center' }}
            onPress={deleteTask}
          >
            <Text style={{ color: 'white' }}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    margin: 35,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  Text: {
    flexDirection: 'column',
    marginLeft: 5,
  },
  input: {
    flexDirection: 'column',
    width: 310,
    height: 40,
    backgroundColor: '#ffffff'
  }
});

export default EditListTask;
