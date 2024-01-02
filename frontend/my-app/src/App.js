import React, { } from 'react';
import './App.css';   
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import Login from './components/Login'
import Header from './components/Header'
import Profile from './components/Profile'
import useToken from './components/useToken'
import Register from './components/Register'
import Home from './components/Home'
import HomeNotLogged from './components/HomeNotLogged'
import Transactions from './components/Transactions';

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <div className="vh-100 gradient-custom">
      <div className="container">
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