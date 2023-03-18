import React from "react";

import { Box, Text, Flex } from "@chakra-ui/react";
import { goerli, useAccount, useBalance, useNetwork } from "wagmi";
import Identicon from "@components/Identicon";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [walletLabel, setWalletLabel] = React.useState("Connect Wallet");
  const { data: balance } = useBalance({ address });
  const { chain } = useNetwork();

  React.useEffect(() => {
    if (chain?.id !== goerli.id && isConnected) {
      setWalletLabel("Wrong chain");
      return;
    }
    if (isConnected && balance) {
      setWalletLabel(
        `${address!.slice(0, 9)}...${Number(balance.formatted).toFixed(3)} ${
          balance.symbol
        }`,
      );
    } else {
      setWalletLabel("Connect Wallet");
    }
  }, [isConnected, address, chain]);
  return (
    <Box>
      <Box my={-5} px={2} py={1} borderWidth={1} borderRadius="2xl">
        <Flex alignItems="center">
          <Text fontSize="xs" as="samp">
            {walletLabel}
          </Text>
          <Text fontSize="xs" as="samp" marginLeft={2}>
            {isConnected && <Identicon />}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
