import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userSlice from "./data/userSlice";
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CameraScreen from './screens/CameraScreen';
import AlbumSreen from './screens/AlbumSreen';

const store = configureStore({
  reducer: {userSlice}
});

function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }}/>
          <Stack.Screen name='Camera' component={CameraScreen} 
            screenOptions={{
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Home'); 
                }}>
                  <Text>Home</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen name='Album' component={AlbumSreen} 
            screenOptions={{ 
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity onPress={() => {
                  navigation.navigate('Home'); 
                }}>
                  <Text>Home</Text>
                </TouchableOpacity>
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;