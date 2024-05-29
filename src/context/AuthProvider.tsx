"use client";

import { User, UserMetadata } from "@/types/types";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

export interface AuthContextType {
  auth: SupabaseUser | null;
  setAuth: Dispatch<SetStateAction<SupabaseUser | null>>;
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
  const [auth, setAuth] = useState<SupabaseUser | null>(null);
  const [authUser, setAuthUser] = useState<UserMetadata | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth, authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
