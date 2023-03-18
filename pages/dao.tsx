import React from "react";
import Layout from "@components/Layout";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from "@chakra-ui/react";

export default function DAO() {
  const [inFavorOf, setInFavorOf] = React.useState("");

  const msgs = () => {
    // eslint-disable-next-line no-console
    console.log({ validators: inFavorOf });
  };

  return (
    <Layout title="DAO Voting">
      <Box
        h="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading mb="4" size="xl" fontWeight="bold">
          The DAO For Compensation
        </Heading>
        <form>
          <FormControl mb="4">
            <FormLabel htmlFor="name" fontWeight="bold">
              Vote To Compensate User With Address
            </FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Deserve Compensation"
              onChange={(e) => setInFavorOf(e.target.value)}
            />
          </FormControl>

          <Box display="flex" alignItems="center" justifyContent="center">
            <Button
              colorScheme="blue"
              borderRadius="full"
              px="8"
              fontWeight="bold"
              onClick={msgs}
            >
              Vote
            </Button>
          </Box>
        </form>
      </Box>
    </Layout>
  );
}
