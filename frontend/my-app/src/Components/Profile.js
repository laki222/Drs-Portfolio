import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';

function Profile(props) {
 
    const [profileData, setProfileData] = useState(null)

    const [formData, setFormData] = useState(null)

    const [currentPassword, setCurrentPassword] = useState('');

    const [editMode, setEditMode] = useState(false);
    
    
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
            Phone: res.Phone,
            Password:res.Password
            
        }))

        setCurrentPassword(({
          Password:res.Password      
      }))



        }).catch((error) => {
          if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
            }
        })
    }
     
    

    const handleSave = () => {

      if (currentPassword.Password !== formData.Password) {
        console.error("Uneseni password se ne poklapa sa trenutnim passwordom.");
        return;
      }


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
          password: profileData.Password
       },
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      })
        .then((response) => {
          console.log(response);
          closeModal(); // Zatvori modal nakon što se podaci sačuvaju
          getUsers();
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
        });
    };





    const openModal = () => {
      setEditMode(true);
    };
  
    const closeModal = () => {
      setEditMode(false);
    };

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
                          <div className="col-6 mb-3">
                            <button type="button" className="btn btn-primary btn-lg" onClick={openModal} >Edit Profile</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                 {/* Modal */}
          <Modal
            isOpen={editMode}
            onRequestClose={closeModal}
            contentLabel="Edit Profile Modal"
            ariaHideApp={false} 
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
                      <label htmlFor="PasswordCurrent">Enter the current password</label>
                      <input
                        
                        type="password"
                        className="form-control"
                        id="PasswordCurrent"
                        name="PasswordCurrent"
                        
                        onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="Password">New password</label>
                      <input
                        
                        type="password"
                        className="form-control"
                        id="Password"
                        name="Password"
                        onChange={(e) => {
                          const newPassword = e.target.value;
                          if (newPassword.trim() !== '') {
                            setProfileData({ ...profileData, Password: newPassword });
                          }}}
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
                      <label htmlFor="LastName">Country</label>
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
                      <label htmlFor="LastName">City</label>
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
                      <label htmlFor="LastName">Address</label>
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
                      <label htmlFor="LastName">Phone</label>
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
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
                    Save
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
      );
      
}
 
export default Profile;