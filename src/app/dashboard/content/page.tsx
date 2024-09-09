import { AuthProvider } from "@/context/AuthProvider";
import React from "react";
import Content from "../Content";
import { createClient } from "../../../../lib/supabase/server";
import ContentLayout from "./ContentLayout";
import { DataFetchProvider } from "@/context/DataFetchProvider";
import { DesignActionProvider } from "@/context/DesignActionProvider";

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
            <DesignActionProvider>
              <div>
                <Content />
              </div>
            </DesignActionProvider>
          </DataFetchProvider>
        </ContentLayout>
      </AuthProvider>
    </>
  );
};

export default ContentPage;
