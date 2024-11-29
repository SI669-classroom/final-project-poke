import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFonts } from 'expo-font';

function ListPicItem(props) {

    const dispatch = useDispatch();
    const { pic, navigation } = props;

    let [fontsLoaded] = useFonts({
      'PixelifySans': require('../assets/fonts/PixelifySans-Regular.ttf'),
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    // delete the item using the async thunk
    const deleteItem = (item) => {
      // dispatch(deleteContactThunk(item.key));
    };
  
    return (
      <View style={styles.listItemContainer}>
        <TouchableOpacity 
          style={styles.li1}
          onPress={()=>{
            // dispatch(selectContact(item.key));
            // navigation.navigate('singleContact', { 
            //   item: item 
            // });
          }}  
        >
          <Text style={styles.listItemText}>{pic.imageName}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.li2}
          onPress={()=>{
            
          }}  
        >
          <Text style={styles.listItemOptionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.li2}
          onPress={()=>{
            deleteItem(item);
          }}  
        >
          <Text style={styles.listItemOptionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.li2}
          onPress={()=>{
            deleteItem(item);
          }}  
        >
          <Text style={styles.listItemOptionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    listItemContainer: {
      width: '95%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: '5%',
      borderBlockColor:'gray',
      borderBottomWidth:1
    },
    li1: {
      flex: 0.9, 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    li2: {
      paddingRight: '3%'
    },
    listItemText: {
      fontSize: 20,
      fontFamily: 'PixelifySans',
      color:'white'
    },
    listItemOptionText: {
      fontFamily: 'PixelifySans', 
      fontSize:15, 
      color:'white'
    }
  });
  
  export default ListPicItem;