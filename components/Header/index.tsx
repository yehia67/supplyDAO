import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import ConnectorsButton from "@components/ConnectorsButton";

export default function Header() {
  return (
    <Flex justify="flex-end">
      <Box flex="1" />
      <Box px={4}>
        <ConnectorsButton />
      </Box>
    </Flex>
  );
}
