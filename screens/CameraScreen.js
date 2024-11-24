import { Button } from '@rneui/themed';
import { Overlay } from '@rneui/themed';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { setPicture } from "../data/userSlice";
import { useState, useRef, useEffect } from 'react';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';


function CameraScreen({ navigation }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.userSlice.currentUser);
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState('back');

  const [grayscaleArray, setGrayscaleArray] = useState([]);
  const [grid, setGrid] = useState({width: 2.5, height: 2.5})
  const [currentScheme, setCurrentScheme] = useState('default');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [saveVisible, setSaveVisible] = useState(false);

  const [zoom, setZoom] = useState(0);
  const [res, setRes] = useState(110);
  const [whiteBalance, setWhiteBalance] = useState('auto');
  const [photoName, setPhotoName] = useState('');

  const cameraRef = useRef(null);
  const viewShotRef = useRef(null);
  const cameraShotRef = useRef();

  const schemes = {
    'default': null,
    'scheme1': [
      { range: [0, 63], color: 'pink' },
      { range: [64, 127], color: 'red' },
      { range: [128, 191], color: 'gray' },
      { range: [192, 255], color: 'black' },
    ],
    'scheme2': [
      { range: [0, 63], color: 'green' },
      { range: [64, 127], color: 'blue' },
      { range: [128, 191], color: 'gray' },
      { range: [192, 255], color: 'black' },
    ],
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // save pixel pictures
  const savePic = async() => {
    if (viewShotRef.current) {
      const p = await viewShotRef.current.capture({
        quality: 0.1, 
        base64: false, 
        skipProcessing: true, 
      });
    }
  }

  // switch cameras
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // adjust picture and gridc cell size 
  const setCellSize = (item) => {
    setRes(item); 
    if (item === 20) {
      setGrid({width: 13.5, height: 12.5});
    } else if (item === 50) {
      setGrid({width: 5.5, height: 5.5});
    } else if (item === 80) {
      setGrid({width: 3.5, height: 3.5});
    } else if (item === 110) {
      setGrid({width: 2.5, height: 2.5});
    }
  }

  // convert image into array
  const captureAndProcessPhoto = async () => {
    if (cameraRef.current) {
      const p = await cameraRef.current.takePictureAsync({
        quality: 0.1, 
        base64: false, 
        skipProcessing: true, 
      });
 
      const manipulatedPhoto = await manipulateAsync(
        p.uri,
        [{ resize: { width: res, height: res } }],
        { base64: false, format: SaveFormat.PNG}
      );
      const a = await sendPhotoToBackend(manipulatedPhoto.uri);
      const cArray = mapToColorScale(a, schemes[currentScheme]);
      if (cArray) {
        setGrayscaleArray(cArray);
      } else {
        setGrayscaleArray(a);
      }
    }
  };

  const sendPhotoToBackend = async (photoUri) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photoUri,
        type: 'image/png', 
        name: 'photo.png',
      });
  
      const response = await fetch('http://192.168.12.151:5000/process-image', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
  
      const rgbArray = await response.json();
      return rgbArray;
    } catch (error) {
      console.error('Error sending photo to backend:', error);
    }
  };

  // map grayscale values to 4 color scales
  const mapToColorScale = (array, color) => {
    if (color) {
      return array.map((row) =>
        row.map((value) => {
          const scale = color.find(
            (scale) => value >= scale.range[0] && value <= scale.range[1]
          );
          return scale ? scale.color : 'black'; // Default to black if no match
        })
      );
    } else {
      return null;
    }
  };

  // render pixel picture
  const displayGrayscaleGrid = (array) => {
    return (
      <View style={styles.gridContainer} ref={viewShotRef}>
        {array.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((value, colIndex) => (
              <View
                key={colIndex}
                style={[
                  grid,
                  {
                    backgroundColor: typeof value === "string"? value:`rgb(${value}, ${value}, ${value})`,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  // save picture
  const picSave = () => {
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.gridPreview}>
        <View>
          <TouchableOpacity onPress={() => setSaveVisible(true)}>
            <Text style={{fontSize:15,color:'white',backgroundColor:'black'}}>Save this picture</Text>
          </TouchableOpacity>
        </View>
        {/* {photo ? <Image source={{ uri: photo }} style={{ width: 320, height: 250 }} 
    resizeMode="contain" /> : <Text>No photo to process</Text>} */}
        {grayscaleArray.length > 0 ? displayGrayscaleGrid(grayscaleArray): <Text>No photo to process</Text>}
      </View>
      
      <View style={styles.cameraContainer}>
        <View style={{paddingBottom:'5%'}}>
          <Button title="Camera settings" color='black' onPress={() => setOverlayVisible(true)}/>
        </View>

        <ViewShot style={styles.cameraFrame} ref={cameraShotRef} options={{ format: 'png', quality: 1.0 }}>
          <CameraView 
            style={styles.camera}
            facing={facing}
            zoom={zoom}
            whiteBalance={whiteBalance}
            ref={cameraRef}
          >
            <View>
              <TouchableOpacity onPress={toggleCameraFacing}>
                <Text style={{fontSize:15,color:'white',backgroundColor:'black'}}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </ViewShot>
        
        <View style={{flexDirection:'row', width:'70%', justifyContent:'space-between', paddingTop:'5%'}}>
          <Button
            onPress={()=>{navigation.navigate('Album')}}
            title="Album"
            color='black'
          />
          <Button
            onPress={captureAndProcessPhoto}
            title="Take photo!"
            color='black'
          />
        </View>
      </View>

      {/* OVERLAY COMPONENT: SHOWN ON TOP WHEN visible==true */}
      <Overlay 
        isVisible={overlayVisible} 
        onBackdropPress={() => setOverlayVisible(false)}
        overlayStyle={{backgroundColor:'white', width:'80%', alignItems:'center'}}  
      >
        <View style={{width:'100%'}}>
          <Text style={{fontSize:23, paddingBottom:'5%', marginHorizontal:'auto'}}>Camera settings</Text>
          <View style={{flexDirection:'row'}}>
            <Text>Zoom:  </Text>
            <FlatList
              horizontal
              data={[0.0, 0.01, 0.05, 0.1]}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => setZoom(item)} 
                  >
                    <Text style={{fontSize:15, width:'100%', paddingHorizontal:'5%'}}>
                      {`x ${item}`}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
          <View style={{flexDirection:'row'}}>
            <Text>Size:  </Text>
            <FlatList
              horizontal
              data={[110,80,50,20]}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {setCellSize(item)}} 
                  >
                    <Text style={{fontSize:15, width:'100%', paddingHorizontal:'1%'}}>
                      {`${item}x${item}`}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
          <View style={{flexDirection:'row'}}>
            <Text>Colors:  </Text>
            <FlatList
                horizontal
                data={['default', 'scheme1', 'scheme2']}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {setCurrentScheme(item)}} 
                    >
                      <Text style={{fontSize:15, width:'100%', paddingHorizontal:'1%'}}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )
                }}
            />
          </View>
          <View style={{flexDirection:'row'}}>
            <Text>White balance:  </Text>
            <FlatList
                horizontal
                data={['auto', 'sunny', 'cloudy']}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {setWhiteBalance(item)}} 
                    >
                      <Text style={{fontSize:15, width:'100%', paddingHorizontal:'1%'}}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )
                }}
            />
          </View>
        </View>
      </Overlay>
      <Overlay 
        isVisible={saveVisible} 
        overlayStyle={{backgroundColor:'white', width:'80%', alignItems:'center'}}  
      >
        <View style={{width:'100%'}}>
        <Text style={{fontSize:23, paddingBottom:'5%', marginHorizontal:'auto'}}>Save</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter picture name here..."
            onChangeText={newText => setPhotoName(newText)}
            value={photoName}
          >
          </TextInput>
          <Button
            onPress={()=>{}}
            title="Save"
            color='black'
            style={{paddingBottom:'3%'}}
          />
          <Button
            onPress={() => {setSaveVisible(false); setPhotoName('')}}
            title="Cancel"
            color='black'
          />
        </View>
        
      </Overlay>
      {/* <Button title="Save Grid as Image" onPress={saveGridAsImage} /> */}
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
  cameraContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cameraFrame: {
    flex: 0.8,
    height: '100%',
    width: '70%',
  },
  camera: {
    height: '100%',
    width: '100%',
  },
  gridPreview: {
    flex: 0.5,
    alignContent: 'center',
    marginTop:'5%',
    backgroundColor: 'white',
    width: '70%',
  },
  gridContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  gridRow: {
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default CameraScreen;
