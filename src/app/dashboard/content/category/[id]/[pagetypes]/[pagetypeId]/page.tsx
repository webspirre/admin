import { AuthProvider } from "@/context/AuthProvider";
import React from "react";
import Content from "@/app/dashboard/Content";
import { createClient } from "../../../../../../../../lib/supabase/server";
import ContentLayout from "./ContentLayout";
import { DataFetchProvider } from "@/context/DataFetchProvider";
import { ResolvingMetadata } from "next";
import { Metadata } from "@/types/types";
import DataFetchProviderWrapper from "./DataFetchProviderWrapper";
type Props = {
  params: { pagetypeId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.pagetypeId;

  return {
    title: `${id}  -  category - webspirre`,
    description: `${id} `,
    opengraph: {
      title: id!,
      description: "",
      image: "",
    },
  };
}

const ContentPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <AuthProvider initialUser={user}>
        <ContentLayout>
          {/* <DataFetchProvider> */}
          <DataFetchProviderWrapper>
            <div>
              <Content />
            </div>
          </DataFetchProviderWrapper>

          {/* </DataFetchProvider> */}
        </ContentLayout>
      </AuthProvider>
    </>
  );
};

export default ContentPage;
