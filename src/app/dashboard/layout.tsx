import React from "react";
import Navbar from "@/components/common/navbar/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import { AuthProvider } from "@/context/AuthProvider";
import { createClient } from "../../../lib/supabase/server";
interface DashboardProps {
  children?: React.ReactNode | null;
}
const DashboardWrapper: React.FC<DashboardProps> = async ({ children }) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const content = (
    <>
      <AuthProvider initialUser={user}>
        <div>
          <div className=" ">
            <Navbar />
            {/* DASHBOARD */}
            <DashboardLayout childrenProp={children} />
          </div>
        </div>
      </AuthProvider>
    </>
  );

  return content;
};

export default DashboardWrapper;
