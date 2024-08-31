"use client";

import useAuth from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const ContentLayout = ({ children }: { children: React.ReactNode }) => {
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default ContentLayout;
