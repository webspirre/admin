import { User } from "@/types/types";
import {User as  SupabaseUser} from "@supabase/supabase-js";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export interface AuthContextType {
  auth: User | null ;
  setAuth: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


