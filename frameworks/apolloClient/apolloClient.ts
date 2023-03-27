import { ApolloClient, DefaultOptions, InMemoryCache } from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

export const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/yehia67/supplydao",
  cache: new InMemoryCache(),
  defaultOptions,
});
