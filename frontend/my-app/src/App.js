import React, { } from 'react';
import './App.css';   
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import Login from './Components/Login'
import Header from './Components/Header'
import Profile from './Components/Profile'
import useToken from './Components/useToken'
import Register from './Components/register'
import Home from './Components/Home'
import HomeNotLogged from './Components/HomeNotLogged'
import Transactions from './Components/Transactions';

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <div className="vh-2950 gradient-custom" style={{ backgroundColor: '#191919' }}>
      <div className="container vh-2950" style={{ backgroundColor: '#191919' }}>
        <BrowserRouter>
          <Header token={removeToken} />
          {!token && token !== "" && token !== undefined ? (
            // Check the message and render Login or Register component accordingly
            <Routes>
              <Route
              exact path="/"
              element={<HomeNotLogged setToken={setToken} />}
            />
              
                <Route
                  path="/register"
                  element={<Register setToken={setToken} />}
                />
                <Route
                  path="/login"
                  element={<Login setToken={setToken} />}
                />
            </Routes>
          ) : (
            <>
              <Routes>
                <Route
                  path="/profile"
                  element={<Profile token={token} setToken={setToken} removeToken={removeToken} />}
                />

                <Route
                  path="/home"
                  element={<Home token={token} setToken={setToken} />}
                />
                <Route
                  path="/transactions"
                  element={<Transactions token={token} setToken={setToken} />}
                />
              </Routes>
            </>
          )}
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;