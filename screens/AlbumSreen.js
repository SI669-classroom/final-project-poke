import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, FlatList, TouchableOpacity, Text, Image, TextInput } from "react-native";
import { Button, Overlay } from '@rneui/themed';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import ListPicItem from '../components/ListPicItem'
import { updatePicture } from "../data/userSlice";

function AlbumScreen({ navigation, route }) {
  const currentUser = useSelector(state => state.userSlice.currentUser);
  const imageList = useSelector((state) => state.userSlice.imageList);
  const selectedPic = useSelector((state) => state.userSlice.selectedImg);
  const {showSort} = route.params || {};
  const {showPic} = route.params || {};
  const {editPic} = route.params || {};
  const [sortVisible, setSortVisible] = useState(false);
  const [byName, setByName] = useState(true);
  const [byNameDirect, setByNameDirect] = useState('↓');
  const [byDate, setByDate] = useState(false);
  const [byDateDirect, setByDateDirect] = useState('↓');
  const [picVisible, setPicVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [newPicName, setNewPicName] = useState('');
  const dispatch = useDispatch();


  let [fontsLoaded] = useFonts({
    'PixelifySans': require('../assets/fonts/PixelifySans-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // show sort options
  useEffect(() => {
    if (showSort !== undefined && !sortVisible) {setSortVisible(true);}
  }, [showSort]);

  // show picture
  useEffect(() => {
    if (showPic !== undefined && !picVisible) {setPicVisible(true);}
  }, [showPic]);

  // show picture edit panel
  useEffect(() => {
    if (editPic !== undefined && !editVisible) {setEditVisible(true);}
  }, [editPic]);

  const sortByName = () => {
    if (byName) {setByNameDirect(current => (current==='↓'? '↑':'↓'));}
    setByName(true);
    setByDate(false);
  }

  const sortByDate = () => {
    if (byDate) {setByDateDirect(current => (current==='↓'? '↑':'↓'));}
    setByDate(true);
    setByName(false);
  }

  const timestamp2date = (t) => {
    const date = new Date(t);
    // Format as MM/DD/YYYY
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`; 
  }

  const updatePic = (newName, selectedPic, user) => {
    const newPic = {
      date: selectedPic.date,
      path: selectedPic.path,
      imageName: newName,
      user: currentUser.key
    }
    dispatch(updatePicture(newPic));
    setNewPicName('');
    setEditVisible(false);
  }

  return(
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={imageList}
          contentContainerStyle={{paddingLeft: '5%'}}
          renderItem={({item}) => {
            return (
              <ListPicItem pic={item} navigation={navigation}/>
            )
          }}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={{width:'20%'}}>
        <Button
          title='Take'
          onPress={() => navigation.navigate('Camera')}
          color='black'
          titleStyle={{fontFamily:'PixelifySans'}}
        ></Button>
      </View>

      {/* sort */}
      <Overlay 
        isVisible={sortVisible} 
        overlayStyle={{backgroundColor:'white', width:'80%', alignItems:'center'}}
        onBackdropPress={() => setSortVisible(false)}
      >
        <Text style={{fontSize:23, paddingBottom:'5%', marginHorizontal:'auto',fontFamily:'PixelifySans'}}>Sort pictures</Text>
        <TouchableOpacity
          onPress={() => {sortByName()}} 
        >
          <Text style={{fontSize:19, width:'100%', paddingHorizontal:'2%',fontFamily:'PixelifySans'}}>
            by name {byNameDirect}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {sortByDate()}} 
        >
          <Text style={{fontSize:19, width:'100%', paddingHorizontal:'2%',fontFamily:'PixelifySans'}}>
            by added date {byDateDirect}
          </Text>
        </TouchableOpacity>
      </Overlay>
      
      {/* picture preview */}
      <Overlay
        isVisible={picVisible} 
        overlayStyle={{backgroundColor:'white', width:280, height:320, alignItems:'center'}}
        onBackdropPress={() => setPicVisible(false)}
      >
        <Image
            style={styles.picture}
            source={{uri: `${selectedPic.path}`}}
          />
        <Text style={{fontSize:20, width:255, paddingHorizontal:'2%', paddingTop:'1%', fontFamily:'PixelifySans'}}>
          {selectedPic.imageName}
        </Text>
        <Text style={{fontSize:15, width:255, paddingHorizontal:'2%',fontFamily:'PixelifySans'}}>
          Date: {timestamp2date(selectedPic.date)}
        </Text>
      </Overlay>
      
      {/* edit picture name */}
      <Overlay 
        isVisible={editVisible} 
        overlayStyle={{backgroundColor:'white', width:'80%', alignItems:'center'}}  
      >
        <View style={{width:'100%'}}>
        <Text style={{fontSize:23, paddingBottom:'5%', marginHorizontal:'auto',fontFamily:'PixelifySans'}}>Edit</Text>
          <TextInput
            style={[styles.input,{fontFamily:'PixelifySans'}]}
            placeholder={selectedPic.imageName}
            onChangeText={newText => setNewPicName(newText)}
            value={newPicName}
          >
          </TextInput>
          <Button
            onPress={()=>{updatePic(newPicName, selectedPic, currentUser)}}
            title="Save new name"
            color='black'
            style={{paddingBottom:'3%'}}
            titleStyle={{fontFamily: 'PixelifySans'}}
          />
          <Button
            onPress={() => {setEditVisible(false)}}
            title="Cancel"
            color='black'
            titleStyle={{fontFamily: 'PixelifySans'}}
          />
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignItems:'center',
      backgroundColor:'black'
    }, 
    listContainer: {
      flex: 0.9,
      width: '100%',
      paddingLeft: '5%',
      paddingTop: '5%'
    },
    picture: {
      width: 255,
      height: 255,
      resizeMode: 'contain'
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 10,
    },
});

export default AlbumScreen;
