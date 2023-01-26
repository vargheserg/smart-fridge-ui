// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";

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
  };