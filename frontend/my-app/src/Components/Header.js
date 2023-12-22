import React, { } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
 
function Header(props) {
 
    const navigate = useNavigate();
     
    function logMeOut() {
        axios({
            method: "POST",
            url:"http://127.0.0.1:5000/api/logout",
        })
        .then((response) => {
            props.token()
            localStorage.removeItem('email')
            navigate("/");
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
    }

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
        <nav className="navbar navbar-expand-lg bg-light">
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
              <a className="navbar-brand" href="/home">Home</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
              </button>
              <button className="btn btn-outline-success" type="submit" onClick={btnTransactions} >Transactions</button>
              <button className="btn btn-outline-success" type="submit" onClick={btnProfile} >Profile</button>
              <button className="btn btn-outline-danger" type="submit" onClick={logMeOut}>Logout</button>
            </>
           
            )}
          </div>

          </div>
        </nav>
    )
}
 
export default Header;