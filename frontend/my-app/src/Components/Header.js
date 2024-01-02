import React, { } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
 
function Header(props) {
 
    const navigate = useNavigate();
     
   

    function btnProfile() {

      navigate("/profile");
    }
    function btnLogin() {

      navigate("/login");
    }
    function btnTransactions(){
    navigate("/transactions");
    }

     
    const logged = localStorage.getItem('email');
     
    return(
      <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {!logged ? (
        <>
        <a className="navbar-brand" href="/">Home</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <button className="btn btn-outline-success" type="submit" onClick={btnLogin} >Login</button>
        </>) : 
        (
        <>
          <div class="container-fluid">
    <a className="navbar-brand " href="/home" style={{ color: 'white' }}>
      <img src="/logo192.png" alt="" width="30" height="24" className="d-inline-block align-text-top"/>
      Home
    </a>
  
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
          <button className="btn btn-outline-light me-2" type="submit" onClick={btnTransactions} >Transactions</button>
          </div>
          <button className="btn btn-outline-light me-2" type="submit" onClick={btnProfile} >Profile</button>
       
        </>
       
        )}
      </div>

      </div>
    </nav>
    )
}
 
export default Header;