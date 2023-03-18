import React from "react";

import Head from "next/head";

import { Toaster } from "react-hot-toast";

import Header from "@components/Header";
import { ChakraProvider } from "@chakra-ui/react";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({
  children,
  title = "This is the default title",
}: LayoutProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Toaster />
      {children}
    </ChakraProvider>
  );
}
