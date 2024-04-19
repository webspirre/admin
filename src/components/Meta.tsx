import Head from "next/head";
import { Metadata } from "@/types/types";

interface MetaProps {
  metadata: Metadata;
}

const Meta: React.FC<MetaProps> = ({ metadata }) => {
  return (
    <Head>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {/* Add other meta tags as needed */}
      {metadata.keywords && (
        <meta name="keywords" content={metadata.keywords.join(",")} />
      )}
      {metadata.opengraph && (
        <>
          <meta property="og:title" content={metadata.opengraph.title} />
          <meta
            property="og:description"
            content={metadata.opengraph.description}
          />
          <meta property="og:image" content={metadata.opengraph.image} />
        </>
      )}
      {metadata.twitter && (
        <>
          <meta name="twitter:card" content={metadata.twitter.card} />
          <meta name="twitter:site" content={metadata.twitter.site} />
        </>
      )}
      {/* Add more meta tags as required */}
    </Head>
  );
};

export default Meta;
