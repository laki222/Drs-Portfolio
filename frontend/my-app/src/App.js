import React, { } from 'react';
import './App.css';   
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import Login from './components/Login'
import Header from './components/Header'
import Profile from './components/Profile'
import useToken from './components/useToken'
import Register from './components/Register'

function App() {
  const { token, removeToken, setToken } = useToken();

  const queryParams = new URLSearchParams(window.location.search);
  const messageFromLogin = queryParams.get("message");

  const queryParams1 = new URLSearchParams(window.location.search);
  const messageFromRegister= queryParams1.get("messageRegister");

  return (
    <div className="vh-100 gradient-custom">
      <div className="container">
        <BrowserRouter>
          <Header token={removeToken} />
          {!token && token !== "" && token !== undefined ? (
            // Check the message and render Login or Register component accordingly
            <Routes>
              <Route
              path="/"
              element={<Login setToken={setToken} />}
            />
              {messageFromLogin === "HelloFromLogin" ? (
                <Route
                  path="/register"
                  element={<Register setToken={setToken} />}
                />
              ) :  null}

          {messageFromRegister === "HelloFromRegister" ? (
                <Route
                  path="/"
                  element={<Login setToken={setToken} />}
                />
              ) :  null}


            </Routes>
          ) : (
            <>
              <Routes>
                <Route
                  path="/profile"
                  element={<Profile token={token} setToken={setToken} />}
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