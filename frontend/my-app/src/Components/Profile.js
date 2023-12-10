import React, { useState, useEffect } from "react";
import axios from "axios";
 
function Profile(props) {
 
    const [profileData, setProfileData] = useState(null)
     
    useEffect(() => {
        getUsers();
    }, []);
     
    const email = localStorage.getItem('email');
     
    function getUsers() { 
        axios({
          method: "GET",
          url:`http://127.0.0.1:5000/api/profile/${email}`, 
          headers: {
            Authorization: 'Bearer ' + props.token
          }
        })
        .then((response) => {
            console.log(response)
          const res =response.data
          res.access_token && props.setToken(res.access_token)
          setProfileData(({
            FirstName: res.FirstName,
            Email: res.Email,
            LastName: res.LastName,
            Address : res.Address,
            City: res.City,
            Country: res.Country,
            Phone: res.Phone
            
        }))
        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })
    }
     
    let imgs = [
      'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp',
    ];
 
 
    return (
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center h-50">
            <div className="col col-lg-12">
              {profileData && (
                <div className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-4 bg-c-lite-green text-center text-white">
                      <img src={imgs[0]} className="img-fluid my-5" width="150" alt="Profile" />
                      <h5>{profileData.profile_name}</h5>
                      <p>Coder</p>
                      <i className="far fa-edit mb-5"></i>
                    </div>
      
                    <div className="col-md-8">
                      <div className="card-body p-4">
                        <h6>Your profile details:</h6>
      
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6>First Name</h6>
                            <p className="text-muted">{profileData.FirstName}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Last Name</h6>
                            <p className="text-muted">{profileData.LastName}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Email</h6>
                            <p className="text-muted">{profileData.Email}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Phone</h6>
                            <p className="text-muted">{profileData.Phone}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Country</h6>
                            <p className="text-muted">{profileData.Country}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>City and address</h6>
                            <p className="text-muted">{`${profileData.City}, ${profileData.Address}`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
      
}
 
export default Profile;