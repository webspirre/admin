import { User, UserMetadata } from "@/types/types";
import { User as SupabaseUser } from "@supabase/supabase-js";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

export interface AuthContextType {
  auth: User | null;
  setAuth: Dispatch<SetStateAction<User | null>>;
  setAuthUser: Dispatch<SetStateAction<UserMetadata | null>>;
  authUser: UserMetadata | null;
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
  authUser: null,
  setAuthUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<UserMetadata | null>(null);

  useEffect(() => {
    const storedUserDataString =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;

    if (storedUserDataString) {
      const parsedUserData = JSON.parse(storedUserDataString);
      setAuthUser(parsedUserData);
    }

    setAuthUser(
      JSON.parse(
        JSON.stringify(JSON.parse(storedUserDataString as string), null, 2)
      )
    );
  }, []);

  useEffect(() => {
    const storedUserDataString =
      typeof window !== "undefined"
        ? localStorage.getItem("sb-nawqzhetlcutvfqhyjsv-auth-token")
        : null;

    if (storedUserDataString) {
      const parsedUserData = JSON.parse(storedUserDataString);
      setAuth(parsedUserData);
    }

    setAuth(
      JSON.parse(
        JSON.stringify(JSON.parse(storedUserDataString as string), null, 2)
      )
    );
  }, []);
  return (
    <AuthContext.Provider value={{ auth, setAuth, authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
