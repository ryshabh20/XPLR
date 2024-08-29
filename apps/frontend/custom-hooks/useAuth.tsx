"use client";
import { createContext, useContext, useEffect, useState } from "react";
import useApi from "./useApi";
import { UserFromBackend } from "../lib/type";
import IconSpinner from "../custom-ui/IconSpinner";
import { usePathname } from "next/navigation";
import { UseQueryResult } from "@tanstack/react-query";
type user = UserFromBackend | null;
const AuthContext = createContext<{ user: user }>({
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();

  const isPublicPath = ["/login", "/register", "/verifyemail"].includes(path);

  const [user, setUser] = useState<user>(null);

  const getUser = useApi({
    method: "GET",
    url: "/users/me",
    queryKey: ["getUser"],
    enabledCondition: !isPublicPath,
  })?.get;

  useEffect(() => {
    setUser(getUser?.data?.user);
  }, [getUser?.data]);
  return (
    <AuthContext.Provider value={{ user }}>
      {getUser?.isLoading && !user && !isPublicPath ? (
        <div className="w-dvh h-dvh flex justify-center items-center bg-black">
          <IconSpinner height={100} width={100} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
