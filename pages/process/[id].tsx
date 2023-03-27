import React from "react";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";
import { apolloClient } from "@frameworks/apolloClient/apolloClient";
import {
  getProcessByIdQuery,
  getProcessQuery,
} from "@frameworks/apolloClient/queries.qgl";
import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@components/Layout";
import { uploadIPFS } from "@frameworks/ipfs";
import { SupplyChainContractArtifacts } from "@abis/contracts";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import toast from "react-hot-toast";

interface IProcessSummary {
  id: string;
  name: string;
  coverImage: string;
  formHash: string;
  status: string;
}

interface FormElement {
  type: string;
  name: string;
}
type Props = {
  process: IProcessSummary;
  errors: string;
};

// eslint-disable-next-line no-unused-vars
export default function StaticPropsDetail({ process, errors }: Props) {
  const [formElements, setFormElements] = React.useState<FormElement[]>([]);
  const [formValue, setFormValue] = React.useState<string[]>([]);
  const [productStatus, setProductStatus] = React.useState<"1" | "2">();
  const [inFavorOf, setInFavorOf] = React.useState("");

  const formHashRef = React.useRef("");

  React.useEffect(() => {
    const fetchForm = async () => {
      const formElement = await fetch(
        `https://ipfs.io/ipfs/${process.formHash}`,
      );
      const formElementJson = await formElement.json();
      setFormElements(formElementJson.inputField);
      setFormValue(Array(formElementJson.inputField.length).fill(""));
    };
    fetchForm();
  }, []);

  const { config, error } = usePrepareContractWrite({
    address: SupplyChainContractArtifacts.address as `0x{}`,
    abi: SupplyChainContractArtifacts.abi as any,
    functionName: "submitReport",
    args: [process.id, productStatus, formHashRef],
  });
  const { write: submitReport } = useContractWrite(config);

  const onSubmit = async () => {
    const formResult = formElements.map((formElement, index) => {
      return {
        [formElement.name]: formValue[index],
      };
    });

    formHashRef.current =
      (await uploadIPFS({
        content: JSON.stringify(formResult),
      })) || "";
    if (!error) {
      submitReport!();
      return;
    }
    toast.error(`${error.toString()}`);
  };
  const { config: voteConfig } = usePrepareContractWrite({
    address: SupplyChainContractArtifacts.address as `0x{}`,
    abi: SupplyChainContractArtifacts.abi as any,
    functionName: "vote",
    args: [process.id, inFavorOf],
  });
  const { write: vote, error: voteError } = useContractWrite(voteConfig);

  const onVote = () => {
    if (!voteError) {
      console.log("yarab", vote, voteError, [process.id, inFavorOf]);
      vote!();
      return;
    }
    toast.error(`${voteError.toString()}`);
  };
  return (
    <Layout title={process.name}>
      <Box maxW="500px" mx="auto">
        <Heading as="h1" size="xl" textAlign="center" mb={8}>
          {process.name}
        </Heading>
        {process.status !== "Investigation" ? (
          <>
            {formElements &&
              formElements.length > 0 &&
              formElements.map((formElement, index) => {
                return (
                  <FormControl
                    key={`${formElement.name}-${index}`}
                    id={`${formElement.name}-${index}`}
                    mb={4}
                  >
                    <FormLabel>{formElement.name}</FormLabel>
                    {formElement.type === "file" ||
                    formElement.type === "image" ? (
                      <Input
                        type="file"
                        onChangeCapture={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          if (event && event.target && event.target.files) {
                            uploadIPFS({
                              content: event.target.files[0],
                            }).then((hash) => {
                              console.log({ formValue });

                              const temp = formValue;
                              temp[index] = hash || "";
                              setFormValue(temp);
                            });
                          }
                        }}
                      />
                    ) : (
                      <Input
                        type={formElement.type}
                        name="name"
                        focusBorderColor="blue.500"
                        borderColor="gray.300"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          console.log({ formValue });
                          const temp = formValue;
                          temp[index] = event.target.value;
                          setFormValue(temp);
                        }}
                      />
                    )}
                  </FormControl>
                );
              })}
            <FormControl id="status" mb={4}>
              <FormLabel>Status</FormLabel>
              <Select
                value={productStatus}
                onChange={(e) => setProductStatus(e.target.value as "2" | "1")}
              >
                <option value="1">Good</option>
                <option value="2">Corrupted</option>
              </Select>
            </FormControl>
            <Button
              colorScheme="blue"
              size="lg"
              w="100%"
              type="button"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </>
        ) : (
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
                onClick={onVote}
              >
                Vote
              </Button>
            </Box>
          </form>
        )}
      </Box>
    </Layout>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apolloClient.query({
    query: getProcessQuery,
  });
  const processes = data.processes as IProcessSummary[];
  const ourGnosisIds = processes.map((process) => parseInt(process.id, 16));

  const paths = ourGnosisIds.map((id) => ({
    params: { id: id.toString() },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const id = params?.id;
    const { data } = await apolloClient.query({
      query: getProcessByIdQuery,
      variables: { id: `0x${Number(id).toString(16)}` },
    });
    console.log("data", data, { id: `0x${Number(id).toString(16)}` });
    return {
      props: { process: data.process },
    };
  } catch (err: any) {
    return { props: { errors: err.message } };
  }
};
