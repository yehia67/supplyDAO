import React from "react";
import { Stack, Text } from "@chakra-ui/react";
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

export default function IndexPage() {
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
    <Layout title="Home | Next.js + TypeScript Example">
      <Stack direction="row" spacing={4}>
        {processes.map((process) => (
          <Link key={process.id} href={`process/${process.id}`}>
            <Stack spacing={2}>
              <Image
                src={`https://ipfs.io/ipfs/${process.coverImage}`}
                alt={process.name}
              />
              <Text>{process.name}</Text>
            </Stack>
          </Link>
        ))}
      </Stack>
    </Layout>
  );
}
