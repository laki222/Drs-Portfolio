import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions(props) {
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    getTransactions();
  });


  function getTransactions() {
    axios({
      method: "GET",
      url: "http://127.0.0.1:5000/api/transactions",
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
      .then((response) => {
        console.log(response);
        setTransactionData(response.data); // Postavljanje podataka u state
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <h2>Transaction List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Crypto Currency</th>
            <th>Transaction Type</th>
            <th>Transaction Date</th>
            <th>Amount</th>
            <th>USD Value</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {transactionData.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.crypto_currency}</td>
              <td>{transaction.transaction_type}</td>
              <td>{transaction.transaction_date}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.usd_value}</td>
              <td>
                <button type="button" className="btn btn-primary">
                  Remove 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default Transactions;
