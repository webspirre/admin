"use client";

import React from "react";
import Upload from "@/app/dashboard/upload";
import useAuth from "@/hooks/useAuth";

interface ContentWrapperProps {
  children?: React.ReactNode;
}
const ContentWrapper: React.FC<ContentWrapperProps> = ({}) => {
  const { loading, setLoading } = useAuth();
  const handleLoading = () => {
    setLoading((prev) => !prev);
  };
  return (
    <>
      <Upload handleLoading={handleLoading} loading={loading} />
    </>
  );
};

export default ContentWrapper;
