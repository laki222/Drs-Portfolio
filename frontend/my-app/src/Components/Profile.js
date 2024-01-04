import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';

function Profile(props) {
 
    const [profileData, setProfileData] = useState(null)

    const [currentPassword, setCurrentPassword] = useState("");

    const [editMode, setEditMode] = useState(false);
    
    
    const [profileDataCheck, setProfileDataCheck] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      if (!profileDataCheck) {
        getUsers();
      }
    }, [profileDataCheck]);

     
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
            Phone: res.Phone,
            Password:res.Password
            
        }))

        setCurrentPassword(res.Password)    
      

      setProfileDataCheck(true);

        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })
    }
     
    

    const handleSave = () => {
      axios({
        method: "PUT",
        url:`http://127.0.0.1:5000/api/edit/${email}`, 
        data:{
          firstName: profileData.FirstName,
          lastName: profileData.LastName,
          address: profileData.Address,
          city: profileData.City,
          country: profileData.Country,
          phone: profileData.Phone,
          email: profileData.Email,
       },
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      })
        .then((response) => {
          console.log(response);
          closeModal(); // Zatvori modal nakon što se podaci sačuvaju
          setProfileDataCheck(false);
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    };




    function logMeOut() {
      console.log("kliknuo")
      axios({
          method: "POST",
          url:"http://127.0.0.1:5000/api/logout",
      })
      .then((response) => {
          props.removeToken()
          console.log("usao")
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

  function changePassword(New){
    console.log(current)
    console.log(currentPassword)

    if(current!==currentPassword){
      alert("The current passoword is not correct,try new one")
      return;
    }

    axios({
      method: "PUT",
      url:`http://127.0.0.1:5000/api/changepassoword`, 
      data:{
        password:New
     },
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
      .then((response) => {
        console.log(response);
        closeModalPassword(); // Zatvori modal nakon što se podaci sačuvaju
        setProfileDataCheck(false);
        setCurrent("");
        setNew("");
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };


  const [New,setNew] = useState("");

  const [current,setCurrent] = useState("");

  const [EditModePassword, setEditModePassword] = useState(false);

  const openModalPassword = () => {
    setEditModePassword(true);
  };

  const closeModalPassword = () => {
    setEditModePassword(false);
  };

    const openModal = () => {
      setEditMode(true);
    };
  
    const closeModal = () => {
      setEditMode(false);
    };

    let imgs = [
      'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp',
    ];
 
 
    return (
      <Box h="100vh" maxH={1700}>
        <div className="container h-950" style={{ backgroundColor: '#191919' }}>
          <div className="row d-flex justify-content-center align-items-center h-50" style={{ backgroundColor: '#191919' }}>
            <div className="col col-lg-12 h-950" style={{ backgroundColor: '#191919' }}>
              {profileData && (
                <div className="card mb-3" style={{ backgroundColor: '#191919', borderColor: 'white', borderWidth: '1px', borderStyle: 'solid' }}>
                  <div className="row g-0">
                    <div className="col-md-4 bg-c-lite-green text-center text-white">
                      <img src={imgs[0]} className="img-fluid my-5" width="150" alt="Profile" />
                      <h5>{profileData.profile_name}</h5>
                      <p>Trader</p>
                      <i className="far fa-edit mb-5"></i>
                    </div>
      
                    <div className="col-md-8">
                      <div className="card-body p-4">
                        <h4 style={{ color: 'white' }}>Your profile details:</h4>
      
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6 style={{ color: 'white' }}>First Name</h6>
                            <p className="text-muted" style={{ color: 'white' }}>{profileData.FirstName}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6 style={{ color: 'white' }}>Last Name</h6>
                            <p className="text-muted" style={{ color: 'white' }}>{profileData.LastName}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6 style={{ color: 'white' }}>Email</h6>
                            <p className="text-muted" style={{ color: 'white' }}>{profileData.Email}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6 style={{ color: 'white' }}>Phone</h6>
                            <p className="text-muted">{profileData.Phone}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6 style={{ color: 'white' }}>Country</h6>
                            <p className="text-muted">{profileData.Country}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6 style={{ color: 'white' }}>City and address</h6>
                            <p className="text-muted">{`${profileData.City}, ${profileData.Address}`}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <button type="button" className="btn btn-lg btn-outline-light bg-dark" onClick={openModal} >Edit my profile</button>
                          </div>
                          <div className="col-6 mb-3">
                            <button type="button" className="btn btn-lg btn-outline-light bg-dark" onClick={openModalPassword} >Change my password</button>
                          </div>
                          <div className="col-7 mb-3">
                          <button type="button" className="btn btn-lg btn-outline-danger bg-dark" onClick={() => logMeOut()}>Logout</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                 
          <Modal
            isOpen={editMode}
            onRequestClose={closeModal}
            contentLabel="Edit Profile Modal"
            ariaHideApp={false} 
            style={{ content: { height: '105%',margin: 'auto', width: '45%', background: 'none', 
            border: 'none' } }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editProfileModalLabel">
                    Edit Profile
                  </h5>
                  <button type="button" className="close" onClick={closeModal} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>

                  <div className="form-group">
                      <label htmlFor="EmailEdit">Email</label>
                      <input
                        readOnly={true}
                        type="text"
                        className="form-control"
                        id="EmailEdit"
                        name="EmailEdit"
                        value={profileData?.Email || ''}
                        onChange={(e) => setProfileData({ ...profileData, Email: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="FirstName">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="FirstName"
                        name="FirstName"
                        value={profileData?.FirstName || ''}
                        onChange={(e) => setProfileData({ ...profileData, FirstName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="LastName">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="LastName"
                        name="LastName"
                        value={profileData?.LastName || ''}
                        onChange={(e) => setProfileData({ ...profileData, LastName: e.target.value })}
                      />
                    </div>
                  
                    <div className="form-group">
                      <label htmlFor="Country">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        id="Country"
                        name="Country"
                        value={profileData?.Country || ''}
                        onChange={(e) => setProfileData({ ...profileData, Country: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="City">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="City"
                        name="City"
                        value={profileData?.City || ''}
                        onChange={(e) => setProfileData({ ...profileData, City: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="Address">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="Address"
                        name="Address"
                        value={profileData?.Address || ''}
                        onChange={(e) => setProfileData({ ...profileData, Address: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="Phone">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="Phone"
                        name="Phone"
                        value={profileData?.Phone || ''}
                        onChange={(e) => setProfileData({ ...profileData, Phone: e.target.value })}
                      />
                    </div>


                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-lg btn-outline-light bg-danger" onClick={closeModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-lg btn-outline-light bg-success " onClick={handleSave}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
        isOpen={EditModePassword}
        onRequestClose={closeModalPassword}
        contentLabel="Edit Profile Modal"
        ariaHideApp={false}
        style={{ content: { height: '50%',margin: 'auto', width: '25%', background: 'none', 
        border: 'none' } }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content d-flex flex-column h-100">
            <div className="modal-header">
              <h5 className="modal-title" id="editProfileModalLabel">
                Change password 
              </h5>
              <button type="button" className="close" onClick={closeModalPassword} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body ">
              <form>
                <div className="form-group">
                  <label htmlFor="current">Current password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="current"
                    name="current"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new">New password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="new"
                    name="new"
                    value={New}
                    onChange={(e) => setNew(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-md btn-outline-light bg-danger" onClick={closeModalPassword}>
                Close
              </button>
              <button type="button" className="btn btn-md btn-outline-light bg-success"  onClick={() => changePassword(New)}>
                Change
              </button>
            </div>
          </div>
        </div>
      </Modal>


                </div>





              )}
            </div>
          </div>
        </div>
        </Box>
      );
      
}
 
export default Profile;