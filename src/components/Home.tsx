import React from "react";
import type { User } from "@supabase/supabase-js";
// import useAuth from "../hooks/useAuth";
import SignIn from "./signin/page";
import Loader from "./common/loader/index";

interface HomeProps {
  user: User | null;
}
const Home: React.FC<HomeProps> = ({ user }) => {
  // const { setAuth } = useAuth();
  // setAuth(user);
  return (
    <>
      <div>{!user ? <SignIn /> : <Loader />}</div>
    </>
  );
};

export default Home;
