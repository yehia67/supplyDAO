import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import ConnectorsButton from "@components/ConnectorsButton";
import Link from "next/link";

export default function Header() {
  return (
    <Box>
      <Flex justify="flex-start">
        <Box px={4}>
          <Link href="/create">Create DAO Process</Link>
        </Box>
        <Box px={4}>
          <Link href="/process">Processes</Link>
        </Box>
      </Flex>
      <Flex justify="flex-end">
        <Box flex="1" />
        <Box px={4}>
          <ConnectorsButton />
        </Box>
      </Flex>
    </Box>
  );
}
