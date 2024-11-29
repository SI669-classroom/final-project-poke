import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Sharing from 'expo-sharing';
import { useFonts } from 'expo-font';
import { selectImg, deletePicture } from "../data/userSlice";

function ListPicItem(props) {
    const currentUser = useSelector(state => state.userSlice.currentUser);
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
      const pic = {
        date: item.date,
        path: item.path,
        user: currentUser.key
      }
      dispatch(deletePicture(pic));
    };

    // share a picture 
    const shareImage = async (imgUri) => {
      try {
        const result = await Sharing.shareAsync(imgUri);
        if (result) {
          if (result.action === Sharing.sharedAction) {
            console.log('Image shared successfully!');
          } else if (result.action === Sharing.dismissedAction) {
            console.log('Share dialog dismissed.');
          }
        }
      } catch (error) {
        console.error('Error sharing image:', error);
      }
    };
  
    return (
      <View style={styles.listItemContainer}>
        <TouchableOpacity 
          style={styles.li1}
          onPress={()=>{
            // select this picture 
            dispatch(selectImg(pic));
            navigation.navigate('Album', {showPic: Math.random()});
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
            shareImage(pic.path);
          }}  
        >
          <Text style={styles.listItemOptionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.li2}
          onPress={()=>{
            deleteItem(pic);
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