import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { initializeApp, getApps } from 'firebase/app';
import {setDoc, addDoc, doc, getFirestore, 
  collection, onSnapshot, getDoc} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
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

export const addUser = createAsyncThunk(
  'app/addUser',
  async (user) => {
    const userToAdd = {
      displayName: user.displayName,
      email: user.email,
      key: user.uid
    };
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

export const setPicture = createAsyncThunk(
  'app/setPicture',
  async (pictureObject) => {
    const currentPhotoRef = ref(storage, 'images/currentPhoto.jpg');
    try {
      // fetch the image object (blob) from the local filesystem
      const response = await fetch(pictureObject.uri);

      // blob: binary large object
      const imageBlob = await response.blob();

      // then upload it to Firebase Storage
      await uploadBytes(currentPhotoRef, imageBlob);

      // get the URL
      const downloadURL = await getDownloadURL(currentPhotoRef);
      return downloadURL;
    } catch (e) {
      console.log("Error saving picture:", e);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    currentUser: {},
    picture: {},
  },
  // reducers is a mandatory argument even if all of our reducers
  // are in extraReducers
  reducers: {
    setPicture: (state, action) => {
      state.picture = action.payload
    },
  },
  extraReducers: (builder) => {
      builder.addCase(setUser.fulfilled, (state, action) => {
      state.currentUser = action.payload
    });

    builder.addCase(setPicture.fulfilled, (state, action) => {
      state.picture = action.payload
    })
  }
})

export { addUser, setUser, setPicture };
export default userSlice.reducer