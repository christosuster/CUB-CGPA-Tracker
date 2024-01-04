"use client";
import { getCookie } from "cookies-next";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext<ContextType | null>(null);

export type ContextType = {
  user: boolean;
  setUser: (user: boolean) => void;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(false);
  const cookie = getCookie("PHPSESSID");
  useEffect(() => {
    if (cookie) {
      setUser(true);
    } else {
      setUser(false);
    }
  }, [cookie]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
