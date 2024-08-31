"use client";

import React from "react";
import ContentWrapper from "@/components/common/upload/ContentWrapper";
import { DataFetchProvider } from "@/context/DataFetchProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import useAuth from "@/hooks/useAuth";
import { redirect } from "next/navigation";

interface ClientWrapperProps {
  designId?: string;
}
const ClientWrapper: React.FC<ClientWrapperProps> = ({ designId }) => {
  const queryClient = new QueryClient();
  const { auth } = useAuth();
  React.useEffect(() => {
    const newUser = auth;
    if (!newUser) {
      return redirect("/");
    }
  }, [auth]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DataFetchProvider designId={designId}>
          <ContentWrapper />
        </DataFetchProvider>
      </QueryClientProvider>
    </>
  );
};

export default ClientWrapper;
