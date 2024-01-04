import React, { useState, useEffect} from "react";
import axios from "axios";
import Modal from 'react-modal';
import {
  Center,
  Text,
  Heading,
  VStack,
  Container,
  HStack, 
  Button,
  ChakraProvider,
  Input
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,LabelList 
} from "recharts";



function Home(props) {
 
    const [profileData, setProfileData] = useState(null)

    const [editMode, setEditMode] = useState(false);
    
    const [editModeCrypto, setEditModeCrypto] = useState(false);

    const [portfolioCost, setPortfolioCost] = useState(0);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [absoluteGain, setAbsoluteGain] = useState(0);
    const [totalGainPercent, setTotalGainPercent] = useState(0);
    const [rollups, setRollups] = useState([]);
    
    const handleSave = () => {
      
      for (var i = 0; i < rollups.length; i++) {
        if(profileData.amount>rollups[i].coins && profileData.crypto_currency===rollups[i].symbol && profileData.transaction_type==='sell'){
          alert("The maximum you can sell is " + rollups[i].coins + ", not how much you put in");
          return;
        }
        if(profileData.crypto_currency!==rollups[i].symbol){
          alert("You are trying to sell a cryptocurrency you do not own");
          return;
        }
    }
    if(rollups.length===0 && profileData.transaction_type==='sell'){
    alert("The first thing you can do is buy cryptocurrency");
    return;
    }



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
          setPortfolioDataFetched(false)
          closeModal(); 
        })
        .catch((error) => {
          console.error('Error adding transaction:', error);
        });
    };

    function removeCrypto(Cryptoname){
      axios({
        method: "POST",
        url:`http://127.0.0.1:5000/api/cryptoremove/${Cryptoname}`, 
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      })
      .then((response) => {
        console.log(response)
        alert("Successfully removed crypto");
        setPortfolioDataFetched(false)
        closeModalCrypto(); 
    })
    .catch((error) => {
      console.error(error);
    });
    }



    const openModal = () => {
      setEditMode(true);
    };
  
    const closeModal = () => {
      setEditMode(false);
    };

    
    const openModalCrypto = () => {
      setEditModeCrypto(true);
    };
  
    const closeModalCrypto = () => {
      setEditModeCrypto(false);
    };
    
    const [portfolioDataFetched, setPortfolioDataFetched] = useState(false);



    useEffect(() => {
      if (!portfolioDataFetched) {
        getPortfolio();
      }
    }, [portfolioDataFetched]);
  
const getPortfolio = () =>  {
  axios({
    method: 'GET',
    url: 'http://127.0.0.1:5000/api/portfolio',
    headers: {
      Authorization: 'Bearer ' + props.token,
    },
  })
    .then((response) => {
      // Assuming the response.data is the JSON data
      const data = response.data;

      setRollups(data);

      let costAccumulator = 0;
      let valueAccumulator = 0;

      data.forEach((item) => {
        costAccumulator += item.total_cost;
        valueAccumulator += item.total_equity;
      });

      let absoluteGain = valueAccumulator - costAccumulator;

      setPortfolioCost(costAccumulator);
      setPortfolioValue(valueAccumulator);
      setAbsoluteGain(absoluteGain);
      if(data.length>0){
        setTotalGainPercent((absoluteGain / costAccumulator) * 100);
      }
     

      setPortfolioDataFetched(true);
    
    })
    .catch((error) => {
      console.error('Error fetching portfolio:', error);
      // Handle the error as needed
    });
}
/* 
useEffect(() => {
  fetch("http://127.0.0.1:5000/api/portfolio", {
    method: "GET", 
    headers: {
      Authorization: 'Bearer ' + props.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setRollups(data);
        let costAccumulator = 0;
        let valueAccumulator = 0;
        
        data.forEach((item) => {
          costAccumulator += item["total_cost"];
          valueAccumulator += item["total_equity"];
        });

        let absoluteGain = valueAccumulator - costAccumulator;

        setPortfolioCost(costAccumulator);
        setPortfolioValue(valueAccumulator);
        setAbsoluteGain(absoluteGain);
        setTotalGainPercent((absoluteGain / costAccumulator) * 100);
      } else {
        console.error("Podaci nisu niz.");
      }
    });
}, []);

*/

const [searchTerm, setSearchTerm] = useState('');

const filteredRollups = rollups.filter((item) =>
  item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const podaciZaGrafikon = searchTerm !== '' ? filteredRollups : rollups;

  const [name, setName] = useState("");
    return (
     
              <>
          <ChakraProvider>
        <Center bg="#191919" color="black" padding={6}>
        <VStack spacing={7} style={{ color: '191919' }}>
          <Heading color={'white'}>Crypto Portfolio</Heading>
          <Button colorScheme='green' variant='solid' borderColor="white" color="white" fontSize="2xl" width={200} height={55} size="lg" bg="green"  onClick={openModal}>
            Add Transaction
          </Button>

          <HStack spacing={6}>
      <Container bg="#872642" >
        <VStack width={160}>
          <Text fontSize="2xl" color="white">
            $ {Number(portfolioCost.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md" color="white">
          Portfolio Cost
          </Text>
        </VStack>
      </Container>
      <Container bg="#872642">
        <VStack width={160}>
          <Text fontSize="2xl" color="white">
            $ {Number(portfolioValue.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md" color="white">
          Portfolio Value
          </Text>
        </VStack>
      </Container>
      <Container bg="#872642">
        <VStack width={160}>
          <Text fontSize="2xl" color="white">
            $ {Number(absoluteGain.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md" color="white"> 
          Absolute Gain / Loss 
          </Text>
        </VStack>
      </Container>
      <Container bg="#872642 " borderColor='white'>
        <VStack width={160}>
          <Text fontSize="2xl" color="white">
            {Number(totalGainPercent.toFixed(2)).toLocaleString()} %
            </Text>
          <Text fontSize="xs" size="md" color="white">
          Gain / Loss %
          </Text>
        </VStack>
      </Container>
    </HStack>

    <Input
        colorScheme='green' variant='solid'
        focusBorderColor='white'
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100"
        borderColor='white'
        color='black'
        border='white'
        type="text"
        placeholder="Search by symbol"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    <Text color={'white'}>Cost vs Equity vs Gain/Loss %</Text>
        <BarChart
        color={'white'}
          width={600}
          height={500}
          data={podaciZaGrafikon}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="symbol" />
          
          <YAxis domain={['auto', 'auto']}/>
          
          <Tooltip />
          <Legend />
          <Bar dataKey="total_equity" fill="#00C49F" name="Total Value">
          <LabelList 
          color="white"
          dataKey="total_equity" 
          position="top"
          formatter={(value) => `$${value.toFixed(2)}`}
          spacing={10} />
        
          </Bar>
        
          <Bar dataKey="total_cost" fill="#FFBB28" name="Total Cost">
          <LabelList
          dataKey="total_cost"
          position="top"
          formatter={(value) => `$${value.toFixed(2)}`}
          />
          </Bar>
          <Bar dataKey="percent" fill="red" name="Gain/Loss %">
          <LabelList
          dataKey="percent"
          position="top"
          formatter={(value) => `${value.toFixed(2)}%`}
          />
          </Bar>
          <Bar dataKey="coins" fill="orange" name="Coins">
          <LabelList
          dataKey="coins"
          position="top"
          formatter={(value) => `${value.toFixed(2)}`}
          />
          </Bar>
        </BarChart>

        <Button colorScheme='red' variant='solid' borderColor="white" color="white" fontSize="2xl" width={280} height={55} size="lg" bg="red"  onClick={openModalCrypto}>
            Remove Crypto currency
          </Button>

    
        </VStack>
      </Center>
      </ChakraProvider>
                <Modal
                  isOpen={editMode}
                  onRequestClose={closeModal}
                  contentLabel="Edit Profile Modal"
                  ariaHideApp={false}
                  style={{ content: { height: '65%',margin: 'auto', width: '25%', background: 'none', 
        border: 'none' } }}
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
                        <button type="button" className="btn btn-md btn-outline-light bg-danger" onClick={closeModal}>
                          Close
                        </button>
                        <button type="button" className="btn btn-md btn-outline-light bg-success" onClick={handleSave}>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>

                <Modal
        isOpen={editModeCrypto}
        onRequestClose={closeModalCrypto}
        contentLabel="Edit Profile Modal"
        ariaHideApp={false}
        style={{ content: { height: '40%',margin: 'auto', width: '25%', background: 'none', 
        border: 'none' } }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content d-flex flex-column h-100">
            <div className="modal-header">
              <h5 className="modal-title" id="editProfileModalLabel">
                Remove Crypto currency
              </h5>
              <button type="button" className="close" onClick={closeModalCrypto} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body ">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Crypto Currency</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-md btn-outline-light bg-danger" onClick={closeModalCrypto}>
                Close
              </button>
              <button type="button" className="btn btn-md btn-outline-light bg-success"  onClick={() => removeCrypto(name)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
 
export default Home;