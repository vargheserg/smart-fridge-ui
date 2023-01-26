import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { UserContext } from './UserContext';
import { getUserFromDB } from './firebase/firebase';

const Main = () => {
  const [userAcc, setUser] = useState();

  useEffect(() => {
    async function populateUserAcc() {
      if (
        !userAcc &&
        sessionStorage.getItem("Auth Token") &&
        sessionStorage.getItem("uid")
      ) {
        const user = await getUserFromDB(sessionStorage.getItem("uid"));
        if (user) {
          setUser(user);
        }
      }
    };
    populateUserAcc();
  }, [userAcc]);

  return (
    <UserContext.Provider value={[userAcc, setUser]}>
      <Routes>
        <Route exact path='/' element={<Dashboard/>}></Route>
        <Route exact path='/login'  element={<Login/>}></Route>
        <Route exact path='/signup' element={<Signup/>}></Route>
      </Routes>  
    </UserContext.Provider>
  );
}

export default Main;