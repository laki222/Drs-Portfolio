import React, { useState, useEffect } from 'react';
import {Text, Box, Heading, Link, Table, Thead, Tr, Th, Tbody, Td, Button } from "@chakra-ui/react";
import axios from 'axios';


function Transactions(props) {
  const [transactionData, setTransactionData] = useState([]);

/*
  useEffect(() => {
    getTransactions();
  });
*/
  const [transactionDataCheck, setPortfolioDataCheck] = useState(false);



    useEffect(() => {
      if (!transactionDataCheck) {
        getTransactions();
      }
    }, [transactionDataCheck]);


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
        setTransactionData(response.data);
        setPortfolioDataCheck(true); // Postavljanje podataka u state
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function btnRemove(id){
    axios({
      method: "POST",
      url:`http://127.0.0.1:5000/api/transactionremove/${id}`, 
      headers: {
        Authorization: 'Bearer ' + props.token
      }
    })
    .then((response) => {
      console.log(response)
      alert("Successfully removed transaction");
      setPortfolioDataCheck(false);
      
      
  })
  .catch((error) => {
    console.error(error);
  });
  }



  return (
    <Box>
      <Heading>Transaction List</Heading>
      {transactionData.length === 0 ? (
        <Text>No transactions have been made.Go to <Link href='/home'>home</Link> to create one </Text>
      ) : (
        <Table className="table">
          <Thead>
            <Tr>
              <Th>Crypto Currency</Th>
              <Th>Transaction Type</Th>
              <Th>Transaction Date</Th>
              <Th>Amount</Th>
              <Th>USD Value</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactionData.map((transaction, index) => (
              <Tr key={index}>
                <Td><b>{transaction.crypto_currency}</b></Td>
                <Td>{transaction.transaction_type}</Td>
                <Td>{transaction.transaction_date}</Td>
                <Td>{transaction.amount}</Td>
                <Td>{transaction.usd_value}</Td>
                <Td>
                  <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => btnRemove(transaction.id)}
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
  
}


export default Transactions;
