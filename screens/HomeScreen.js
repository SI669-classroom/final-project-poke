import { Button } from '@rneui/themed';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../AuthManager';
import { useFonts } from 'expo-font';
import { fetchUserImagesThunk } from "../data/userSlice";
import { useEffect, useState } from 'react';

function HomeScreen({navigation}) {
  let currentUser = useSelector(state => state.userSlice.currentUser);
  const dispatch = useDispatch();

  let [fontsLoaded] = useFonts({
    'PixelifySans': require('../assets/fonts/PixelifySans-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    if (currentUser.key) {
      dispatch(fetchUserImagesThunk(currentUser.key));
    }
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Text style={{padding:'5%', fontSize:34, fontFamily:'PixelifySans'}}>
        GBCamera
      </Text>

      <Text style={{padding:'5%',fontFamily:'PixelifySans',fontSize:18}}>
        Hi, {currentUser?.displayName}! Welcome back!
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
          <Text style={{fontSize:20,fontFamily:'PixelifySans'}}>Album</Text>
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
          <Text style={{fontSize:20,fontFamily:'PixelifySans'}}>Take</Text>
        </TouchableOpacity>
      </View>

      
      <Button
          type='clear'
          size='sm'
          onPress={async () => {
            signOut();
          }}
          titleStyle={{fontFamily:'PixelifySans',color:'black'}}
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