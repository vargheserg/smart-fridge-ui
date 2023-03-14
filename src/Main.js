import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Fridges from './pages/fridges/Fridges';
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
      } else if(!userAcc && !sessionStorage.getItem("uid") && !sessionStorage.getItem("Auth Token") && !window.location.href.includes('/login') &&!window.location.href.includes('/signup')) {
        window.location.href = '/login';
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
        <Route exact path='/fridges' element={<Fridges/>}></Route>
      </Routes>  
    </UserContext.Provider>
  );
}

export default Main;