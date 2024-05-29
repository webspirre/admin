import { AuthProvider } from "@/context/AuthProvider";
import { getURL } from "../../lib/helpers";
import type { Metadata } from "next";
import { createClient } from "../../lib/supabase/server";
import SignIn from "@/components/signin/page";
import Loader from "@/components/common/loader/index";
import { redirect } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Home from "@/components/Home";
/// export MetaData
const meta = {
  title: "Webspirre Admin Management Dashboard",
  description: "Webspirre Content Management System (CMS) Platform",
  cardImage: "/og.png",
  robots: "follow, index",
  favicon: "/favicon.ico",
  url: getURL(),
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: "origin-when-cross-origin",
    keywords: ["Vercel", "Supabase", "Next.js"],
    authors: [{ name: "Vercel", url: "https://vercel.com/" }],
    creator: "Vercel",
    publisher: "Vercel",
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: "website",
      siteName: meta.title,
    },
    twitter: {
      card: "summary_large_image",
      site: "@Vercel",
      creator: "@Vercel",
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
    },
  };
}
export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // const { setAuth } = useAuth();
  // setAuth(user);
  if (user) {
    // Redirect logged in users to the dashboard
    redirect("/dashboard");
  }

  console.log("USER LOG", user);

  const content = (
    <>
      <AuthProvider>
        {/* <div>{!user ? <SignIn /> : <Loader />}</div> */}
        <Home user={user} />
      </AuthProvider>
    </>
  );

  return content;
}
// export default Page;
