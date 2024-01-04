import React, { } from "react";
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
      <nav className="navbar navbar-expand-lg bg-dark" >
      <div className="container-fluid" >
      <div className="collapse navbar-collapse" id="navbarSupportedContent" >
        {!logged ? (
        <>
        <div className="container-fluid">
    <a className="navbar-brand " href="/" style={{ color: 'white' , fontSize: '24px'}} >
      <img src="/logo192.png"  width="27" height="27" className="d-inline-block align-text-center"/>
      My Portfolio
    </a>
  
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
 </div>
          <button className="btn btn-outline-light me-2" type="submit" onClick={btnLogin} >Login</button>
         
        </>) : 
        (
        <>
          <div className="container-fluid"  >
    <a className="navbar-brand " href="/home"  style={{ color: 'white', fontSize: '24px' }}>
      <img src="/logo192.png"  width="27" height="27" className="d-inline-block align-text-top"/>
      My Portfolio
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