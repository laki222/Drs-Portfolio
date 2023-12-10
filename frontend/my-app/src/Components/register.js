import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
function Register(props) {
      
    const [loginForm, setRegisterForm] = useState({
        FirstName: "",
        LastName: "",
        Address: "",
        City: "",
        Country: "",
        Phone: "",
        Email: "",
        Password: "",
        confirmPassword: ""

    })
 
    const navigate = useNavigate();
     
    function btnregister(event) {
        axios({
            method: "POST",
            url:"http://127.0.0.1:5000/api/register",
            data:{
                FirstName: loginForm.FirstName,
                LastName: loginForm.LastName,
                Address: loginForm.Address,
                City: loginForm.City,
                Country: loginForm.Country,
                Phone: loginForm.Phone,
                Email: loginForm.Email,
                Password: loginForm.Password
             }
        })
        .then((response) => {
            console.log(response)
            props.setToken(response.data.access_token)
            alert("Successfully Register");
            localStorage.setItem('email', loginForm.Email)
            navigate('/profile');
        }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
              console.log(error.response.headers)
                if (error.response.status === 401) {
                    alert("Invalid credentials");
                }
            }
        })
 
        setRegisterForm(({
        FirstName: "",
        LastName: "",
        Address: "",
        City: "",
        Country: "",
        Phone: "",
        Email: "",
        Password: "",
        confirmPassword: ""}))
 
        event.preventDefault()
    }
 
    function handleChange(event) { 
      const {value, name} = event.target
      setRegisterForm(prevNote => ({
          ...prevNote, [name]: value})
      )}
 
    let imgs = [
      'https://as1.ftcdn.net/v2/jpg/03/39/70/90/1000_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg',
    ];
     
    const passwordsMatch = loginForm.password === loginForm.confirmPassword;

    return (
        <div>
          <div className="container h-50">
            <div className="container-fluid h-custom">
              <div className="row d-flex justify-content-center align-items-center h-50">
                <div className="col-md-9 col-lg-6 col-xl-5">
                  <img src={imgs[0]} className="img-fluid" alt="Registration" />
                </div>
                <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                  <form>
                    <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                      <p className="lead fw-normal mb-0 me-3">Registration</p>
                    </div>
      
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example1">Email address</label>
                      <input type="email" value={loginForm.Email} onChange={handleChange} name="Email" id="form3Example1" className="form-control form-control-lg" placeholder="Enter a valid email address" />
                    </div>
      
                    <div className="form-outline mb-3">
                      <label className="form-label" htmlFor="form3Example2">Password</label>
                      <input type="password" value={loginForm.Password} onChange={handleChange} name="Password" id="form3Example2" className="form-control form-control-lg" placeholder="Enter password" />
                    </div>
      
                    <div className="form-outline mb-3">
                      <label className="form-label" htmlFor="form3Example5">Confirm password</label>
                      <input type="password" value={loginForm.confirmPassword} onChange={handleChange} name="confirmPassword" id="form3Example5" className="form-control form-control-lg" placeholder="Enter password" />
                      {!passwordsMatch && (
                        <p>Passwords do not match. Please fix your passwords.</p>
                      )}
                    </div>
      
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example6">First name</label>
                      <input type="text" value={loginForm.FirstName} onChange={handleChange} name="FirstName" id="form3Example6" className="form-control form-control-lg" placeholder="Enter first name" />
                    </div>
      
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example7">Last name</label>
                      <input type="text" value={loginForm.LastName} onChange={handleChange} name="LastName" id="form3Example7" className="form-control form-control-lg" placeholder="Enter last name" />
                    </div>
      
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example8">Phone</label>
                      <input type="tel" value={loginForm.Phone} onChange={handleChange} name="Phone" id="form3Example8" className="form-control form-control-lg" placeholder="Enter phone number" />
                    </div>
      
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example9">Country</label>
                      <input type="text" value={loginForm.Country} onChange={handleChange} name="Country" id="form3Example9" className="form-control form-control-lg" placeholder="Enter country" />
                    </div>
      
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example10">City</label>
                      <input type="text" value={loginForm.City} onChange={handleChange} name="City" id="form3Example10" className="form-control form-control-lg" placeholder="Enter city" />
                    </div>
      
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="form3Example11">Address</label>
                      <input type="text" value={loginForm.Address} onChange={handleChange} name="Address" id="form3Example11" className="form-control form-control-lg" placeholder="Enter address" />
                    </div>
      
                    <div className="text-center text-lg-start mt-4 pt-2">
                      <button type="button" className="btn btn-primary btn-lg" onClick={btnregister}>Register</button>
                      <p className="small fw-bold mt-2 pt-1 mb-0">Have an account? <a  href="/?messageRegister=HelloFromRegister" className="link-danger">Login</a></p>
                    </div>
      
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      
   
}
export default Register;