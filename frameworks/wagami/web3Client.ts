import { EthereumClient, w3mConnectors } from "@web3modal/ethereum";
import { configureChains, createClient, goerli } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()],
);

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: w3mConnectors({
    chains: [goerli],
    projectId,
    version: 1,
  }),
});

const web3ModalClient = new EthereumClient(wagmiClient, chains);

export { chains, web3ModalClient, wagmiClient, projectId };
