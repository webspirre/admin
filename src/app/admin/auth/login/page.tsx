import Meta from "@/components/Meta";
import PageLayout from "@/components/common/PageLayout";
import { authPageMetadata } from "@/util/util";

const Login = () => {
  return (
    <>
      <Meta metadata={authPageMetadata} />
      <PageLayout>
        <h1>login</h1>
      </PageLayout>
    </>
  );
};
export default Login;
