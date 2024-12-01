import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userSlice from "./data/userSlice";
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CameraScreen from './screens/CameraScreen';
import AlbumSreen from './screens/AlbumSreen';
import { useFonts } from 'expo-font';
import { TouchableOpacity, Text } from 'react-native';

const store = configureStore({
  reducer: {userSlice}
});

function App() {
  let [fontsLoaded] = useFonts({
    'PixelifySans': require('./assets/fonts/PixelifySans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='Camera' component={CameraScreen} 
            options={({ navigation }) => ({
              headerTitleStyle: {
                fontFamily: 'PixelifySans', 
                fontSize: 28,
                color: 'white',
              },
              headerTitle: 'Take',
              headerStyle: {
                backgroundColor: 'black',
              },
              // contentStyle: {
              //   borderTopColor: '#131313',
              //   borderTopWidth: 3,
              // },
              headerLeft: () => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Home'); 
                }}>
                  <Text style={{color:'white',fontSize:18,fontFamily: 'PixelifySans'}}>Home</Text>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Camera', { showSettings: Math.random()}); 
                }}>
                  <Text style={{color:'white',fontSize:18,fontFamily: 'PixelifySans'}}>Settings</Text>
                </TouchableOpacity>
              ),
            })}
            screenOptions={{
              headerShown: true,
            }}
          />
          <Stack.Screen name='Album' component={AlbumSreen} 
            options={({ navigation }) =>({
              headerTitleStyle: {
                fontFamily: 'PixelifySans', 
                fontSize: 28,
                color: 'white',
              },
              headerStyle: {
                backgroundColor: 'black',
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Home'); 
                }}>
                  <Text style={{color:'white',fontSize:18,fontFamily: 'PixelifySans'}}>Home</Text>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Album', { showSort: Math.random()}); 
                }}>
                  <Text style={{color:'white',fontSize:18,fontFamily: 'PixelifySans'}}>Sort</Text>
                </TouchableOpacity>
              ),
            })}
            screenOptions={{ 
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;