import UploadWrapper from "@/components/common/UploadWrapper";
import { AuthProvider } from "@/context/AuthProvider";
import { createClient } from "../../../../../../lib/supabase/server";
import { ResolvingMetadata } from "next";
import { Metadata, Props } from "@/types/types";
import { getCachedDesignById } from "../../../../../../lib/supabase/queries/designs";

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  // Initiate fetchDesignByID without awaiting
  const designPromise = getCachedDesignById(id);

  const design = await designPromise;

  // Process the data
  const designName = typeof design?.name === 'string' && design.name.trim() ? design.name : "Name";
  const designCategory =
    Array.isArray(design?.categories) && design.categories.length > 0
      ? (typeof design.categories[0] === "string" &&
          design.categories[0].trim()) ||
        "Default Category"
      : "Default Category";
  const designDescription =
    typeof design?.shortDescription === "string" &&
    design.shortDescription.trim()
      ? design.shortDescription
      : "Default Description";

  return {
    title: `${designName} - ${designCategory} - website detail`,
    description: designDescription,
    opengraph: {
      title: designName as string,
      description: designDescription,
      image: "",
    },
  };
}
const EditPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <AuthProvider initialUser={user}>
        <div>
          <UploadWrapper designId={params.id} />
        </div>
      </AuthProvider>
    </>
  );
};
export default EditPage;
