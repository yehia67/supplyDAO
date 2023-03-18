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

import Layout from "@components/Layout";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { SupplyChainContractArtifacts } from "@abis/contracts";
import { uploadIPFS } from "@frameworks/ipfs";
import toast from "react-hot-toast";

type InputType = "text" | "number" | "image";
interface IInputField {
  inputType: InputType;
}

interface IDaoDetails {
  name: string;
  insuranceAmount: number;
  validators: string[];
  imageHash: string;
}
export default function Create() {
  const [daoDetails, setDaoDetails] = React.useState<IDaoDetails>({
    name: "",
    insuranceAmount: 0,
    validators: [],
    imageHash: "",
  });
  const [validators, setValidators] = React.useState([""]);
  const [inputNames, setInputNames] = React.useState([""]);
  const [fields, setFields] = React.useState<IInputField[]>([
    { inputType: "text" },
  ]);
  const [formHash, setFormHash] = React.useState("");

  const addField = () => {
    setFields([...fields, { inputType: "text" }]);
    setInputNames([...inputNames, ""]);
  };
  const addValidator = () => {
    setValidators([...validators, ""]);
  };

  const handleValidatorsChange = (index: number, validator: string) => {
    const newValidators = [...daoDetails.validators];
    newValidators[index] = validator;
    setDaoDetails({ ...daoDetails, validators: newValidators });
  };

  const handleFieldsChange = (index: number, type: InputType) => {
    const newFields = [...fields];
    newFields[index].inputType = type;
    setFields(newFields);
  };

  const handleInputNames = (index: number, name: string) => {
    const newInputNames = [...inputNames];
    newInputNames[index] = name;
    setInputNames(newInputNames);
  };
  const { config } = usePrepareContractWrite({
    address: SupplyChainContractArtifacts.address as `0x{}`,
    abi: SupplyChainContractArtifacts.abi,
    functionName: "addProcess",
    args: [
      daoDetails.name,
      daoDetails.validators,
      daoDetails.insuranceAmount,
      formHash,
      daoDetails.imageHash,
    ],
  });
  const { write: addProcessWeb3, error } = useContractWrite(config);
  const onSubmit = async () => {
    const inputField = fields.map((field, index) => {
      return {
        type: field.inputType,
        name: inputNames[index],
      };
    });
    const currentFormHash = await uploadIPFS({
      content: JSON.stringify({ inputField }),
    });
    setFormHash(currentFormHash as string);
    if (error) {
      toast.error(`${error.toString()}`);
      return;
    }
    addProcessWeb3!();
  };

  return (
    <Layout title="Create A Supply Chain Process">
      <Box
        display="flex"
        height="100vh"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Heading mb="4" as="h1" size="xl" fontWeight="bold">
          Supply Chain Process
        </Heading>
        <Box width="100%" maxW="md" as="form">
          <FormControl mb="4">
            <FormLabel fontWeight="bold" color="gray.700" htmlFor="name">
              Name
            </FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              focusBorderColor="blue.500"
              borderColor="gray.300"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDaoDetails({ ...daoDetails, name: event.target.value })
              }
            />
          </FormControl>
          <FormControl mb="4">
            <FormLabel
              fontWeight="bold"
              color="gray.700"
              htmlFor="usdInsuranceDeposit"
            >
              USD insurance deposit
            </FormLabel>
            <Input
              id="usdInsuranceDeposit"
              name="usdInsuranceDeposit"
              type="number"
              placeholder="USD insurance deposit"
              focusBorderColor="blue.500"
              borderColor="gray.300"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDaoDetails({
                  ...daoDetails,
                  insuranceAmount: Number(event.target.value),
                })
              }
            />
          </FormControl>
          <Box mb={4}>
            <FormLabel
              fontWeight="bold"
              color="gray.700"
              htmlFor="validators"
              mb={2}
            >
              Supply chain validators
            </FormLabel>
            {validators.map((validator, index) => (
              <Box key={`${validator}-${index}`} mb={2} display="flex">
                <Input
                  mr={4}
                  rounded="md"
                  border="1px"
                  borderColor="gray.400"
                  py={2}
                  px={4}
                  type="text"
                  placeholder="Validator addresses"
                  value={daoDetails.validators[index]}
                  onChange={(e) =>
                    handleValidatorsChange(index, e.target.value)
                  }
                />
              </Box>
            ))}
            <Button
              rounded="md"
              bg="blue.500"
              py={2}
              px={4}
              fontWeight="bold"
              color="white"
              _hover={{ bg: "blue.700" }}
              type="button"
              onClick={addValidator}
            >
              Add validator
            </Button>
          </Box>
          <Box maxW="container.xl" mx="auto">
            <Heading mb={4} fontSize="2xl" fontWeight="bold">
              Dynamic Form
            </Heading>
            <Button
              mb={4}
              rounded="full"
              bg="blue.500"
              py={2}
              px={4}
              fontWeight="bold"
              color="white"
              _hover={{ bg: "blue.700" }}
              type="button"
              onClick={addField}
            >
              Add Field
            </Button>
            <Box>
              {fields.map((field, index) => (
                <Box
                  mb={4}
                  display="flex"
                  alignItems="center"
                  key={`${field.inputType}-${index}`}
                >
                  <Input
                    mr={4}
                    rounded="md"
                    border="1px"
                    borderColor="gray.400"
                    py={2}
                    px={4}
                    type="text"
                    placeholder="Enter Field Name"
                    value={inputNames[index]}
                    onChange={(e) => handleInputNames(index, e.target.value)}
                  />
                  <Select
                    value={field.inputType}
                    onChange={(e) =>
                      handleFieldsChange(index, e.target.value as InputType)
                    }
                  >
                    <option value="">Select Field Type</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="image">Image</option>
                    <option value="file">File</option>
                  </Select>
                </Box>
              ))}
            </Box>
          </Box>
          <FormControl id="image">
            <FormLabel>Upload Image</FormLabel>
            <Input
              type="file"
              onChangeCapture={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event && event.target && event.target.files) {
                  uploadIPFS({
                    content: event.target.files[0],
                  }).then((hash) => {
                    setDaoDetails({ ...daoDetails, imageHash: hash as string });
                  });
                }
              }}
            />
          </FormControl>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button
              type="button"
              onClick={onSubmit}
              fontWeight="bold"
              bgColor="blue.500"
              color="white"
              _hover={{ bgColor: "blue.700" }}
              _focus={{ outline: "none", boxShadow: "outline" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
