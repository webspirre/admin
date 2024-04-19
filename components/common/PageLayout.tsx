import * as React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <main className="">
      <>{children}</>
    </main>
  );
};

export default PageLayout;
