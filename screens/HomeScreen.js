import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch  } from 'react-redux';
import { signOut, getAuthUser } from '../AuthManager';
import { setUser } from "../data/userSlice";
import { useEffect, useState } from 'react';

function HomeScreen({navigation}) {
  const currentUser = useSelector(state => state.userSlice.currentUser);
  const picture = useSelector(state => state.userSlice.picture);
  //const [currentUser, setCurrentUser] = useState({});
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setUser(getAuthUser()))
  //   console.log(getAuthUser())
  // }, []);

  // console.log('in HomeScreen, currentUser:', currentUser);
  return (
    <View style={styles.container}>
      <Text style={{padding:'5%', fontSize:34}}>
        GBCamera
      </Text>

      <Text style={{padding:'5%'}}>
        Hi, {currentUser?.displayName}! Welcome back
      </Text>
      <View style={styles.listContainer}>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={async () => {
            navigation.navigate('Album');
          }}
        >
          <Image
            style={styles.logo}
            source={require('../assets/album.png')}
          />
          <Text style={{fontSize:20}}>Album</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={async () => {
            navigation.navigate('Camera');
          }}
        >
          <Image
            style={styles.logo}
            source={require('../assets/take.png')}
          />
          <Text style={{fontSize:20}}>Take</Text>
        </TouchableOpacity>
      </View>

      
      <Button
          type='clear'
          size='sm'
          onPress={async () => {
            signOut();
          }}
        >
          {'Sign Out'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navHeader: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    padding: '5%',
    //backgroundColor: 'green'
  },
  listContainer: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems: 'center',
    width: '100%'
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  }
});

export default HomeScreen;