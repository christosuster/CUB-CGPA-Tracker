"use client";
import Image from "next/image";
import logo from "../public/logo.png";
import { LogOut, LucideGithub } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { deleteCookie, getCookie } from "cookies-next";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContextType, UserContext } from "./context/UserContext";
const Navbar = () => {
  const cookie = getCookie("PHPSESSID");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, setUser } = useContext(UserContext) as ContextType;

  useEffect(() => {
    setMounted(true);
  }, [cookie]);

  const logOut = () => {
    setUser(false);
    deleteCookie("PHPSESSID");
    router.push("/login");
  };

  return (
    <header className="relative border-b p-2 flex justify-center items-center w-full ">
      <Image src={logo} alt="Logo" width={120} />

      <div className="hover:text-white transition-all absolute text-muted-foreground left-3 top-1/2 -translate-y-1/2">
        <Link href="/" className="flex gap-1">
          <LucideGithub className="" />
          <span className="hidden md:block">View on Github</span>
        </Link>
      </div>

      <div className="hover:text-white absolute text-muted-foreground right-3 top-1/2 -translate-y-1/2">
        {mounted && cookie && user && (
          <Button onClick={logOut} variant="outline" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
