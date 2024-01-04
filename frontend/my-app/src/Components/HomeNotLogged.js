import React from "react";
import {useNavigate} from "react-router-dom";
import { ChakraProvider, Box, Center, Heading, Text, Image, VStack, HStack, UnorderedList, ListItem, Button } from "@chakra-ui/react";

function HomeNotLogged() {
  const navigate = useNavigate();

  function btnLogin() {

    navigate("/login");
  }
  function btnRegister() {

    navigate("/register");
  }
  

  return (
    <ChakraProvider>
      <Box h="100vh" maxH={967}>
        <div>
          <Center>
           
          </Center>
          <HStack padding={50}>
            <VStack align="start" flex="1">
            <Heading color="white" >
              The Only Free Crypto Portfolio Tracker Worth Using
            </Heading>
              {/* Tekst na levoj strani */}
              <Text color="gray" fontSize="xl">
                Connect all your wallets and exchanges in a few clicks. 
                Start effectively managing your entire portfolio crypto
                directly from CoinMarketCap. Track, buy, swap, and earn 
                on your assets from a unified dashboard.
              </Text>
              <UnorderedList>
                <ListItem color="white" fontSize="xl">Track holdings in real-time</ListItem>
                <ListItem color="white" fontSize="xl">Customize your dashboard</ListItem>
                <ListItem color="white" fontSize="xl">Fast and efficient</ListItem>
                <ListItem color="white" fontSize="xl">Easy to use</ListItem>
              </UnorderedList>
              <HStack>
              <Button textAlign={'center' }
                    colorScheme='red' variant='solid' borderColor="white" color="white" fontSize="xl" width={250} height={50}  bg="orange"
                   
                    type="button"
                  onClick={btnRegister}
                  >
                    Create your Portfolio
                  </Button>
                  <Button textAlign={'center'}
                    colorScheme='gray' variant='solid' borderColor="white" color="white" fontSize="xl" width={150} height={50}  bg="gray"
                   
                    type="button"
                  onClick={btnLogin}
                  >
                    Login
                  </Button>
                  </HStack>
            </VStack>
            <Box mt={8} ml={50} display="flex">
              {/* Slika na desnoj strani sa belim okvirom */}
              <Image
                
                src="/home.png"
                alt="View of login/home page"
                width="100%"  // Postavite na "100%" da biste proširili sliku na širinu kontejnera
                maxW="none" 
                
                objectFit="cover"
                border="2px solid white"
              />
            </Box>
          </HStack>
        </div>
      </Box>
    </ChakraProvider>
  );
}

export default HomeNotLogged;
