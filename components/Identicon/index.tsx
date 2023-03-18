import React from "react";
// @ts-expect-error
// eslint-disable-next-line import/no-extraneous-dependencies
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import { useAccount } from "wagmi";

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: black;
`;

export default function Identicon() {
  const ref = React.useRef<HTMLDivElement>();
  const { address } = useAccount();

  React.useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(address.slice(2, 10), 16)));
    }
  }, [address]);

  return <StyledIdenticon ref={ref as any} />;
}
