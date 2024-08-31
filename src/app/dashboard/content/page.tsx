import { AuthProvider } from "@/context/AuthProvider";
import React from "react";
import Content from "../Content";
import { createClient } from "../../../../lib/supabase/server";
import ContentLayout from "./ContentLayout";
import { DataFetchProvider } from "@/context/DataFetchProvider";

const ContentPage = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <AuthProvider initialUser={user}>
        <ContentLayout>
          <DataFetchProvider>
            <div>
              <Content />
            </div>
          </DataFetchProvider>
        </ContentLayout>
      </AuthProvider>
    </>
  );
};

export default ContentPage;
