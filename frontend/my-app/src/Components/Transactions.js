import React, { useState, useEffect } from 'react';
import {Text, Box, Heading, Link, Table, Thead, Tr, Th, Tbody, Td, Button,ChakraProvider,Center } from "@chakra-ui/react";
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
    <ChakraProvider maxH={1700}>
    <Center bg="#191919" color="black" padding={9}>
    <Box h="100vh" maxH={1700}>
      <Heading color={'white'}>Transaction List</Heading>
      {transactionData.length === 0 ? (
        <Text>No transactions have been made.Go to <Link href='/home'>home</Link> to create one </Text>
      ) : (
        <Table className="table">
          <Thead>
            <Tr>
              <Th textAlign={'center'} color={'white'}>Crypto Currency</Th>
              <Th textAlign={'center'} color={'white'}>Transaction Type</Th>
              <Th textAlign={'center'} color={'white'}>Transaction Date</Th>
              <Th textAlign={'center'} color={'white'}>Amount</Th>
              <Th textAlign={'center'} color={'white'}>USD Value</Th>
              <Th textAlign={'center'} color={'white'}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactionData.map((transaction, index) => (
              <Tr key={index}>
                <Td verticalAlign={'middle'} textAlign={'center'} color={'white'}><b>{transaction.crypto_currency}</b></Td>
                <Td verticalAlign={'middle'} textAlign={'center'} color={'white'}>{transaction.transaction_type}</Td>
                <Td verticalAlign={'middle'} textAlign={'center'} color={'white'}>{transaction.transaction_date}</Td>
                <Td verticalAlign={'middle'} textAlign={'center'} color={'white'}>{transaction.amount}</Td>
                <Td verticalAlign={'middle'} textAlign={'center'} color={'white'}>{transaction.usd_value}</Td>
                <Td>
                  <Button textAlign={'center'}
                    colorScheme='red' variant='solid' borderColor="white" color="white" fontSize="xxs" width={40}   bg="red"
                   
                    type="button"
                  
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
    </Center>
    </ChakraProvider>
  );
  
}


export default Transactions;
