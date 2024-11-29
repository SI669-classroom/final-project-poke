import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initializeApp, getApps } from 'firebase/app';
import {setDoc, getDocs, addDoc, doc, getFirestore, 
  collection, onSnapshot, getDoc, deleteDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import { firebaseConfig } from '../Secrets';

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);
const storage = getStorage(app);

export const subscribeToUserUpdates = (dispatch) => {
  let snapshotUnsubscribe = undefined;
  if (snapshotUnsubscribe) {
    snapshotUnsubscribe();
  }
  snapshotUnsubscribe = onSnapshot(collection(db, 'users'), usersSnapshot => {
    const updatedUsers = usersSnapshot.docs.map(uSnap => {
      return uSnap.data();
    });
    dispatch(loadUsers(updatedUsers));
  });
}

export const loadUsers = createAsyncThunk(
  'chat/loadUsers',
  async (users) => {
    return [...users];
  }
)

// fetch user from Firebase
export const fetchUserImagesThunk = createAsyncThunk(
  'app/fetchUserImages',
  async (id) => {
    try {
      // Reference to the user's document
      const userDocRef = doc(db, 'users', id);
      // Reference to the user's 'image' subcollection
      const imageCollectionRef = collection(userDocRef, 'image');
      // Fetch all documents from the 'image' subcollection
      const querySnapshot = await getDocs(imageCollectionRef);
      // Map documents to a list of objects
      const imageList = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Document data
      })).filter((image) => image.path !== 'void');
      return imageList;
    } catch (error) {
      console.error('Error fetching user images:', error);
      throw error; 
    }
  }
);

export const addUser = createAsyncThunk(
  'app/addUser',
  async (user) => {
    // new user
    const userToAdd = {
      displayName: user.displayName,
      email: user.email,
      key: user.uid
    };
    // add the new user to the firebase
    await setDoc(doc(db, 'users', user.uid), userToAdd);
    const userDocRef = doc(db, 'users', user.uid);
    const subcollectionRef = collection(userDocRef, 'image');
    // Add a document to the subcollection
    await addDoc(subcollectionRef, {
      imageName: 'void',
      path: 'void',
      date: Date.now(),
    });
  }
)

export const setUser = createAsyncThunk(
  'add/setUser',
  async (authUser) => {
    const userSnap = await getDoc(doc(db, 'users', authUser.uid));
    const user = userSnap.data();
    return user;
  }
)

export const addPicture = createAsyncThunk(
  'app/addPicture',
  async (pic) => {
    const currentPhotoRef = ref(storage, `images/${pic.picName}.png`);
    try {
      // fetch the image object (blob) from the local filesystem
      const response = await fetch(pic.uri);
      // blob: binary large object
      const imageBlob = await response.blob();
      // then upload it to Firebase Storage
      await uploadBytes(currentPhotoRef, imageBlob);
      // get the URL
      const downloadURL = await getDownloadURL(currentPhotoRef);

      // Reference to the user's 'image' subcollection
      const userDocRef = doc(db, 'users', pic.user);
      const imageCollectionRef = collection(userDocRef, 'image');
      // Add a image document to the subcollection
      const img = {
        imageName: pic.picName,
        path: downloadURL,
        date: Date.now(),
      }
      await addDoc(imageCollectionRef, img);
      return img;
    } catch (e) {
      console.log("Error saving picture:", e);
    }
  }
);

export const deletePicture = createAsyncThunk(
  'app/deletePicture',
  async (picName, picPath, user) => {
    const currentPhotoRef = ref(storage, `images/${picNmae}.png`);
    try {
      // Reference to the image in Firebase Storage
      const storageRef = ref(storage, `images/${picName}.png`);
      // Delete the image from Firebase Storage
      await deleteObject(storageRef);

      // Reference to the user's 'image' subcollection
      const userDocRef = doc(db, 'users', user.key);
      const imageCollectionRef = collection(userDocRef, 'image');
      // Query to find the document in the 'image' subcollection
      const q = query(imageCollectionRef, where('path', '==', picPath));
      const querySnapshot = await getDocs(q);
      // Delete the document(s) in the Firestore subcollection
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
      });
      return picPath;
    } catch (e) {
      console.log("Error saving picture:", e);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    currentUser: {},
    picture:{},
    imageList: [],
  },
  // reducers is a mandatory argument even if all of our reducers
  // are in extraReducers
  reducers: {
    addPicture: (state, action) => {
      state.picture = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });

    builder.addCase(addPicture.fulfilled, (state, action) => {
      const pic = action.payload;
      state.imageList = {...state.imageList, pic}
    });
    builder.addCase(deletePicture.fulfilled, (state, action) => {
      const picPath = action.payload;
      state.imageList = state.imageList.filter((image) => image.path !== picPath);
    });
    builder.addCase(fetchUserImagesThunk.fulfilled, (state, action) => {
      state.imageList = action.payload;
    })
  }
})

export { fetchUserImagesThunk, addUser, setUser, addPicture };
export default userSlice.reducer