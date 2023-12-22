import React, { useState} from "react";
import axios from "axios";
import Modal from 'react-modal';

function Home(props) {
 
    const [profileData, setProfileData] = useState(null)

    const [editMode, setEditMode] = useState(false);
    
    const handleSave = () => {

      axios({
        method: "POST",
        url:`http://127.0.0.1:5000/api/transaction`, 
        data:{
          crypto_currency: profileData.crypto_currency,
          transaction_type: profileData.transaction_type,
          transaction_date: profileData.transaction_date,
          amount: profileData.amount,
          usd_value: profileData.usd_value,
       },
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      })
        .then((response) => {
          console.log(response);
          closeModal(); 
        })
        .catch((error) => {
          console.error('Error adding transaction:', error);
        });
    };

    const openModal = () => {
      setEditMode(true);
    };
  
    const closeModal = () => {
      setEditMode(false);
    };

    return (
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center h-50">
          <div className="col col-lg-12">
            
              <>
              <div className="mx-auto">
              <button type="button" className="btn btn-primary btn-lg" onClick={openModal}>
              Add Transaction
              </button>
              </div>


                <Modal
                  isOpen={editMode}
                  onRequestClose={closeModal}
                  contentLabel="Edit Profile Modal"
                  ariaHideApp={false}
                >
                  <div className="modal-dialog" role="document" >
                    <div className="modal-content d-flex flex-column h-100">
                      <div className="modal-header ">
                        <h5 className="modal-title" id="editProfileModalLabel">
                          Transaction
                        </h5>
                        <button type="button" className="close" onClick={closeModal} aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body flex-grow-1">
                        <form>
                          <div className="form-group">
                            <label htmlFor="Crypto_currency">Crypto Currency</label>
                            <input
                              type="text"
                              className="form-control"
                              id="Crypto_currency"
                              name="Crypto_currency"
                              
                              onChange={(e) => setProfileData({ ...profileData, crypto_currency: e.target.value })}
                            />
                          </div>
    
                          <div className="form-group form-inline">
                            <label htmlFor="TransactionType" className="mr-2">Transaction Type</label>
                            <div className="form-check mr-2">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="sell"
                                name="transactionType"
                                value="sell"
                            
                                onChange={() => setProfileData({ ...profileData, transaction_type: "sell" })}
                              />
                              <label className="form-check-label" htmlFor="sell">
                                Sell
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                id="buy"
                                name="transactionType"
                                value="buy"
                               
                                onChange={() => setProfileData({ ...profileData, transaction_type: "buy" })}
                              />
                              <label className="form-check-label" htmlFor="buy">
                                Buy
                              </label>
                            </div>
                          </div>
    
                          <div className="form-group">
                            <label htmlFor="Transaction_date">Transaction Date</label>
                            <input
                              type="date"
                              className="form-control"
                              id="transaction_date"
                              name="transaction_date"
                             
                              onChange={(e) => setProfileData({ ...profileData, transaction_date: e.target.value })}
                            />
                          </div>
    
                          <div className="form-group">
                            <label htmlFor="Amount">Amount</label>
                            <input
                              type="text"
                              className="form-control"
                              id="amount"
                              name="amount"
                             
                              onChange={(e) => setProfileData({ ...profileData, amount: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="usd_value">USD Value</label>
                            <input
                              type="text"
                              className="form-control"
                              id="usd_value"
                              name="usd_value"
                              
                              onChange={(e) => setProfileData({ ...profileData, usd_value: e.target.value })}
                            />
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                          Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </>
            
          </div>
        </div>
      </div>
    );    
}
 
export default Home;