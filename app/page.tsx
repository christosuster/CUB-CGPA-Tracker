"use client";
import Chart from "@/components/Chart";
import { Loader2 } from "lucide-react";
import { SemesterGPA } from "@/utils/types";
import { useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [data, setData] = useState<SemesterGPA[]>([]);
  const router = useRouter();
  const cookie = getCookie("PHPSESSID");
  // const { cookie } = useContext(CookieContext) as ContextType;

  useEffect(() => {
    if (!cookie) {
      router.push("/login");
      return;
    }
    console.log(cookie);
    fetch(`${process.env.NEXT_PUBLIC_URL}api/getUserData`, {
      method: "POST",
      body: JSON.stringify({
        cookie: cookie,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setData(data);
          console.log(data);
        });
      } else {
        toast.error("Error: " + res.statusText);
      }
    });
  }, [cookie]);

  return (
    <div className="w-full">
      {data.length > 0 ? (
        <Chart data={data} />
      ) : (
        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
      )}
    </div>
  );
}
