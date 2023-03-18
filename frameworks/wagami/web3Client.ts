import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { configureChains, createClient, goerli } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider(), walletConnectProvider({ projectId })],
);

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: modalConnectors({
    appName: "supplyDAO",
    chains: [goerli],
    version: "2",
    projectId,
  }),
});

const web3ModalClient = new EthereumClient(wagmiClient, chains);

export { chains, web3ModalClient, wagmiClient, projectId };
