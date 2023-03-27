import { gql } from "@apollo/client";

export const getProcessQuery = gql`
  {
    processes {
      id
      name
      coverImage
    }
  }
`;

export const getProcessByIdQuery = gql`
  query ($id: String!) {
    process(id: $id) {
      id
      name
      coverImage
      formHash
      status
    }
  }
`;
