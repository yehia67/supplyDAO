import React from "react";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { apolloClient } from "@frameworks/apolloClient/apolloClient";
import { getProcessQuery } from "@frameworks/apolloClient/queries.qgl";
import Layout from "@components/Layout";

interface IProcessSummary {
  id: string;
  name: string;
  coverImage: string;
}

export default function Process() {
  const [processes, setProcesses] = React.useState<IProcessSummary[]>([]);

  React.useEffect(() => {
    const fetchProcesses = async () => {
      const { data } = await apolloClient.query({
        query: getProcessQuery,
      });
      setProcesses(data.processes);
    };
    fetchProcesses();
  }, []);
  return (
    <Layout title="Supply chain Processes">
      <Heading as="h2" size="lg" textAlign="center" mb={4}>
        Available Supply Chain Processes
      </Heading>
      <Box display="flex" alignItems="center">
        <Stack direction="row" spacing={4}>
          {processes.map((process) => (
            <Link key={process.id} href={`process/${parseInt(process.id, 16)}`}>
              <Stack spacing={2}>
                <Image
                  src={`https://ipfs.io/ipfs/${process.coverImage}`}
                  alt={process.name}
                  width={500}
                  height={100}
                />
                <Text>{process.name}</Text>
              </Stack>
            </Link>
          ))}
        </Stack>
      </Box>
    </Layout>
  );
}
