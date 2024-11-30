
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { signUp, signIn, subscribeToAuthChanges, getAuthUser } from '../AuthManager';
import {addUser, setUser} from "../data/userSlice";
import { useFonts } from 'expo-font';

function SigninBox({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let [fontsLoaded] = useFonts({
    'PixelifySans': require('../assets/fonts/PixelifySans-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const dispatch = useDispatch();

  return (
    <View style={{flex:1, alignItems:'center'}}>
      <Text style={[styles.loginHeaderText, {fontSize: 34}]}>GBCamera</Text>
      <View style={styles.loginContainer}>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter email address' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setEmail(text)}
              value={email}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter password' 
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text=>setPassword(text)}
              value={password}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <Button
            titleStyle={{fontFamily:'PixelifySans'}}
            color='black'
            onPress={async () => {
              try {
                const authUser = await signIn(email, password);
                dispatch(setUser(authUser));
              } catch(error) {
                Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
              }
            }}
          >
            Sign In
          </Button>  
        </View>
      </View>
    </View>
    
  );
}

function SignupBox({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const dispatch = useDispatch();

  return (
    <View style={{flex:1, alignItems:'center'}}>
      <Text style={[styles.loginHeaderText, {fontSize: 34}]}>GBCamera</Text>
      <View style={styles.loginContainer}>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Display Name: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter display name' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setDisplayName(text)}
              value={displayName}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter email address' 
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text=>setEmail(text)}
              value={email}
            />
          </View>
        </View>

        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput 
              style={styles.loginInputBox}
              placeholder='enter password' 
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text=>setPassword(text)}
              value={password}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <Button
            titleStyle={{fontFamily:'PixelifySans'}}
            color="black"
            onPress={async () => {
              try {
                try {
                  const authUser = await signUp(displayName, email, password);
                  dispatch(addUser(authUser));
                } catch(error) {
                  Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
                }  
              } catch(error) {
                Alert.alert("Sign Up Error", error.message,[{ text: "OK" }])
              }
            }}
          >
            Sign Up
          </Button>  
        </View>
      </View>
    </View>
  );
}

function LoginScreen({navigation}) {

  const [loginMode, setLoginMode] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    subscribeToAuthChanges(navigation, dispatch);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {loginMode?
          <SigninBox navigation={navigation}/>
        :
          <SignupBox/>
        }
        </View>
      <View styles={styles.modeSwitchContainer}>
        { loginMode ? 
          <Text style={{fontFamily:'PixelifySans', color:'white'}}>New user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={styles.signText}> Sign up </Text> 
            instead!
          </Text>
        :
          <Text style={{fontFamily: 'PixelifySans', color:'white'}}>Returning user? 
            <Text 
              onPress={()=>{setLoginMode(!loginMode)}} 
              style={styles.signText}> Sign in </Text> 
            instead!
          </Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '15%'
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: '30%',
    paddingBottom: '10%',
  },
  loginHeader: {
    color: 'white',
    width: '100%',
    padding: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'PixelifySans'
  },
  loginHeaderText: {
    fontSize: 20,
    color: 'white',
    paddingBottom: '5%',
    fontFamily: 'PixelifySans'
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: '3%'
  },
  loginLabelContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  loginLabelText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'PixelifySans'
  },
  loginInputContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%'
  },
  loginInputBox: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 6,
    fontSize: 18,
    padding: '2%',
    backgroundColor: 'lightgray',
    fontFamily: 'PixelifySans'
  },
  modeSwitchContainer:{
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginButtonRow: {
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  listContainer: {
    flex: 0.7, 
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
  },
  signText: {
    color: 'red',
    fontFamily: 'PixelifySans'
  }
});

export default LoginScreen;