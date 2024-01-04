"use client";
import LoginForm from "@/components/LoginForm";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const cookie = getCookie("PHPSESSID");
    if (cookie) {
      router.push("/");
      return;
    }
    setMounted(true);
  }, []);

  return (
    <div className="w-full">
      {mounted ? (
        <LoginForm />
      ) : (
        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
      )}
    </div>
  );
}
