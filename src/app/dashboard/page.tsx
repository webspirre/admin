import UploadWrapper from "@/components/common/UploadWrapper";
import { AuthProvider } from "@/context/AuthProvider";
import { createClient } from "../../../lib/supabase/server";

const UploadPage = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <AuthProvider initialUser={user}>
        <div>
          <UploadWrapper />
        </div>
      </AuthProvider>
    </>
  );
};
export default UploadPage;
