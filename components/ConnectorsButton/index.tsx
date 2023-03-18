import React from "react";

import { useWeb3Modal } from "@web3modal/react";
import {
  goerli,
  useAccount,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import Profile from "@components/Profile";

export default function ConnectorsButton() {
  const [loading, setLoading] = React.useState(false);
  const { open, setDefaultChain } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
  });
  async function onOpen() {
    setLoading(true);
    await open();
    setLoading(false);
  }

  function onClick() {
    if (isConnected && chain?.id === goerli.id) {
      disconnect();
    } else if (isConnected && switchNetwork) {
      switchNetwork(goerli.id);
    } else {
      onOpen();
    }
  }
  setDefaultChain(goerli);

  return (
    <button type="button" onClick={onClick} disabled={loading}>
      {loading ? "Loading..." : <Profile />}
    </button>
  );
}
