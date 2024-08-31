"use client";

import { UserMetadata } from "@/types/types";
import { User as SupabaseUser } from "@supabase/supabase-js";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

export interface AuthContextType {
  auth: SupabaseUser | null;
  setAuth: Dispatch<SetStateAction<SupabaseUser | null>>;
  setAuthUser: Dispatch<SetStateAction<UserMetadata | null>>;
  authUser: UserMetadata | null;
  userId?: string | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {},
  authUser: null,
  setAuthUser: () => {},
  userId: null,
  loading: false,
  setLoading: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: SupabaseUser | null;
}

export const AuthProvider = ({ children, initialUser }: AuthProviderProps) => {
  const [auth, setAuth] = useState<SupabaseUser | null>(initialUser!);
  const [authUser, setAuthUser] = useState<UserMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = initialUser && initialUser?.id;
  const value = useMemo(
    () => ({ auth, setAuth, authUser, setAuthUser, userId, loading, setLoading }),
    [auth, setAuth, authUser, setAuthUser, userId, loading, setLoading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;