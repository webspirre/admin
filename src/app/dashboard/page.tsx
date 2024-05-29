// "use server"
import Image from "next/image";
import Link from "next/link";
import Upload from "@/app/dashboard/upload";
import { createClient } from "../../../lib/supabase/server";
import Navbar from "@/components/common/navbar/Navbar";
import DashboardLayout from "@/components/DashboardLayout";

async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user data", user);
  const content = (
    <>
      <div>
        <div className=" ">
          <Navbar user={user} />
          {/* DASHBOARD */}
          <DashboardLayout user={user} />
        </div>
      </div>
      {/* </AuthProvider> */}
    </>
  );

  return content;
}
export default Page;
