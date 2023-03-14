// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {

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
      const data = doc.docs[0].data();
  
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
    //console.log(`User Doc ${user_doc}`);
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


const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    getUserFromDB,
    logout,
    getFridgesFromDB
};