// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, setDoc, collection, where, addDoc, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    return res;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getUserFromDB = async (uid) => {
    try {
      const userQuery = query(collection(db, "users"), where("uid", "==", uid));
      const doc = await getDocs(userQuery);
      const id = doc.docs[0].id
      const data = {doc_id: id, ...doc.docs[0].data()};
      return data;
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
};

const getFridgesFromDB = async (uid) => {
  try {
    const user_doc = await getUserFromDB(uid)
    const user_doc_id = user_doc.doc_id
    const fridgeQuery = query(collection(db, "users", user_doc_id, "fridges"));
    const doc = await getDocs(fridgeQuery);
    const data = []
    doc.docs.forEach(docRef => {
      const id = docRef.id;
      data.push({doc_id: id, ...docRef.data()});
    });
    return data;
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const getFridgeFromDB = async (uid, fridge_id) => {
  try {
    const user_doc = await getUserFromDB(uid)
    const user_doc_id = user_doc.doc_id
    const fridgeQuery = query(collection(db, "users", user_doc_id, "fridges"));
    const doc = await getDocs(fridgeQuery);
    const fridge_doc = doc.docs.find(docRef => fridge_id === docRef.id);
    if(fridge_doc != null){
      return fridge_doc.data();
    }
    return null;
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const updateFridgeTrackingFromDB = async (uid, fridge_id, tracking) => {
  try {
    const user_doc = await getUserFromDB(uid)
    const user_doc_id = user_doc.doc_id
    const fridge_ref = query(doc(db, "users", user_doc_id, "fridges", fridge_id));
    const fridge_doc = await getDoc(fridge_ref);
    if(fridge_doc != null){
      const fridge_data = fridge_doc.data()
      fridge_data["tracking"] = tracking
      return setDoc(fridge_ref, fridge_data);
    }
    return null;
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};


const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    updateFridgeTrackingFromDB,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    getUserFromDB,
    logout,
    getFridgesFromDB,
    getFridgeFromDB
};