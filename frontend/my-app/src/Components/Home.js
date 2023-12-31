import React, { useState, useEffect} from "react";
import axios from "axios";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import {
  Center,
  Text,
  Heading,
  VStack,
  Button,
  useDisclosure,
  Container,
  HStack,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,LabelList 
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#F28042",
  "#9fd3c7",
  "#142d4c",
  "#feff9a",
  "#ffb6b9",
  "#fae3d9",
  "#bbded6",
  "#61c0bf",
];


function Home(props) {
 
    const [profileData, setProfileData] = useState(null)

    const [editMode, setEditMode] = useState(false);
    
    const [portfolioCost, setPortfolioCost] = useState(0);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [absoluteGain, setAbsoluteGain] = useState(0);
    const [totalGainPercent, setTotalGainPercent] = useState(0);
    const [rollups, setRollups] = useState([]);
    const navigate = useNavigate();
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
          setPortfolioDataFetched(false)
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
      setTotalGainPercent((absoluteGain / costAccumulator) * 100);

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

    return (
     
              <>
          
        <Center bg="white" color="black" padding={8}>
        <VStack spacing={7}>
          <Heading>Crypto Portfolio</Heading>
          <Text>This is the current state of your portfolio</Text>
          <Button fontSize="2xl" width={200} height={55} size="lg" bg="green" colorScheme="green" onClick={openModal}>
            Add Transaction
          </Button>

          <HStack spacing={6}>
      <Container bg="tomato" >
        <VStack width={160}>
          <Text fontSize="2xl">
            $ {Number(portfolioCost.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md">
          Portfolio Cost
          </Text>
        </VStack>
      </Container>
      <Container bg="tomato">
        <VStack width={160}>
          <Text fontSize="2xl">
            $ {Number(portfolioValue.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md">
          Portfolio Value
          </Text>
        </VStack>
      </Container>
      <Container bg="tomato">
        <VStack width={160}>
          <Text fontSize="2xl">
            $ {Number(absoluteGain.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md"> 
          Absolute Gain / Loss 
          </Text>
        </VStack>
      </Container>
      <Container bg="tomato">
        <VStack width={160}>
          <Text fontSize="2xl">
            {Number(totalGainPercent.toFixed(2)).toLocaleString()} %
            </Text>
          <Text fontSize="xs" size="md">
          Gain / Loss %
          </Text>
        </VStack>
      </Container>
    </HStack>

    <input
        type="text"
        placeholder="Search by symbol"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    <Text>Cost vs Equity vs Gain/Loss %</Text>
        <BarChart
          width={600}
          height={500}
          data={rollups}
          margin={{
            top: 15,
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
          dataKey="total_equity" 
          position="top"
          formatter={(value) => `$${value.toFixed(2)}`} />
        
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
        </BarChart>

        <Button fontSize="2xl" width={200} height={55} size="lg" bg="red" colorScheme="green" onClick={openModal}>
            Remove Crypto currency
          </Button>

        <HStack>
          <VStack>
            <Text>Cost Distribution</Text>
            <PieChart width={250} height={250}>
              <Pie data={rollups} dataKey="total_cost" nameKey="symbol">
                {rollups.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend></Legend>
              <Tooltip></Tooltip>
            </PieChart>
          </VStack>
          <VStack>
            <Text>Value Distribution</Text>
            <PieChart width={250} height={250}>
              <Pie data={rollups} dataKey="total_equity" nameKey="symbol">
                {rollups.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend></Legend>
              <Tooltip></Tooltip>
            </PieChart>
          </VStack>
        </HStack>
        </VStack>
      </Center>

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
            
       
    );    
}
 
export default Home;