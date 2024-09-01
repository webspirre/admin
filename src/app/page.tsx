import { AuthProvider } from "@/context/AuthProvider";
import { getURL } from "../../lib/helpers";
import type { Metadata } from "next";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Home from "@/components/Home";
import useClearFormStorage from "@/hooks/custom-hooks/localstorage/useClearFormStorage";
const meta = {
  title: "Webspirre Admin Management Dashboard",
  description: "Webspirre Content Management System (CMS) Platform",
  cardImage: "//webspirre-logo.svg",
  robots: "follow, index",
  favicon: "/favicon.ico",
  url: getURL(),
  webspirrelogo: "/webspirre-logo.svg",
};

export async function generateMetadata(): Promise<Metadata> {
  const absoluteImageUrl = `${meta.url}/webspirre-logo.svg`;
  return {
    title: meta.title,
    description: meta.description,
    referrer: "origin-when-cross-origin",
    keywords: [
      "Admin Dashboard",
      "Security",
      "Analytics",
      "Content Management System",
    ],
    authors: [
      { name: "Webspirre CMS", url: "https://admin-correbicle.vercel.app/" },
    ],
    creator: "Webspirre",
    publisher: "Webspirre",
    robots: meta.robots,
    icons: { icon: absoluteImageUrl },
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
      site: "@webspirre",
      creator: "@webspirre",
      title: meta.title,
      description: meta.description,
      images: [absoluteImageUrl],
    },
  };
}
export default async function Page() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Redirect logged in users to the dashboard
    // useClearFormStorage();
    redirect("/dashboard");
  }

  console.log("USER LOG", user);

  const content = (
    <>
      <AuthProvider initialUser={user}>
        <Home user={user} />
      </AuthProvider>
    </>
  );

  return content;
}
