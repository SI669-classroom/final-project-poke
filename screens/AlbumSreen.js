import { useSelector } from "react-redux";
import { StyleSheet, View, FlatList, TouchableOpacity, Text } from "react-native";
import { Button, Overlay } from '@rneui/themed';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import ListPicItem from '../components/ListPicItem'

function AlbumScreen({ navigation, route }) {
  const imageList = useSelector((state) => state.userSlice.imageList);
  const {showSort} = route.params || {};
  const [sortVisible, setSortVisible] = useState(false);
  const [byName, setByName] = useState(true);
  const [byNameDirect, setByNameDirect] = useState('↓');
  const [byDate, setByDate] = useState(false);
  const [byDateDirect, setByDateDirect] = useState('↓');


  let [fontsLoaded] = useFonts({
    'PixelifySans': require('../assets/fonts/PixelifySans-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    if (showSort !== undefined && !sortVisible) {setSortVisible(true);}
  }, [showSort]);

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
});

export default AlbumScreen;
