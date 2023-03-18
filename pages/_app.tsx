import React from "react";
import { AppProps } from "next/app";

import { WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";

import { projectId, wagmiClient, web3ModalClient } from "@frameworks/wagami";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}

      <Web3Modal projectId={projectId} ethereumClient={web3ModalClient} />
    </>
  );
}
