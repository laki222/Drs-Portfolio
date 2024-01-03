import React, { useState, useEffect } from "react";
import { Box,Header, Heading } from "@chakra-ui/react";

function HomeNotLogged() {
    return (
      <Box h="100vh" maxH={1700}>
      <div>
        <Heading color="white">Welcome to my app</Heading>
      </div>
      </Box>
    );
  }

  export default HomeNotLogged;