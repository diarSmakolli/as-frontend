import React from "react";
import * as chakra from "@chakra-ui/react";

export default function Loader() {
  return (
    <>
      <chakra.Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={1000}
        width="400px"
        height="auto"
        rounded="xl"
        p="5"
      >
        <chakra.Text
          fontFamily={"Inter"}
          fontWeight={"400"}
          color="gray.500"
          textAlign={"center"}
          fontSize="lg"
        >
          Please hold on while we process your request. This may take a
          moment...
        </chakra.Text>
        <br />
        <chakra.Center>
          <chakra.Spinner color="gray.400" size="sm" />
        </chakra.Center>
      </chakra.Box>
    </>
  );
}
