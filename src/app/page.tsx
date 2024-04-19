import Image from "next/image";
import Dashboard from "../app/admin/dashboard/page";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="">
      <Toaster />
      <Dashboard />
    </main>
  );
}
