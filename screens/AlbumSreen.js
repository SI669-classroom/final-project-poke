import { useSelector } from "react-redux";
import { StyleSheet, View, FlatList} from "react-native";

function AlbumScreen({navigation}) {
    return(
        <View style={styles.container}>
          <View style={styles.listContainer}>
            {/* <FlatList
              data={groups}
              contentContainerStyle={{paddingLeft: '5%'}}
              renderItem={({item}) => {
                return (
                  <GroupListItem group={item} navigation={navigation}/>
                )
              }}
            /> */}
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    }, 
    listContainer: {
      flex: 1,
      width: '100%',
      paddingLeft: '5%',
      paddingTop: '5%'
    },
});

export default AlbumScreen;
