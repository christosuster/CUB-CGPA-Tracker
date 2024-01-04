"use client";
import Chart from "@/components/Chart";
import { AlertTriangle, Loader2 } from "lucide-react";
import { SemesterGPA, course } from "@/utils/types";
import { useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GradesTable from "@/components/GradesTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type response = {
  status: string;
  data?: {
    semesterGPA: SemesterGPA[];
    name: string;
    id: string;
    image: string;
    courses: course[];
  };
  message?: string;
};

export default function Home() {
  const [data, setData] = useState<SemesterGPA[] | undefined>([]);
  const [name, setName] = useState<string | undefined>("");
  const [id, setId] = useState<string | undefined>("");
  const [image, setImage] = useState<string | undefined>("");
  const [courses, setCourses] = useState<course[] | undefined>([]);
  const router = useRouter();
  const cookie = getCookie("PHPSESSID");
  const [loading, setLoading] = useState(true);
  // const { cookie } = useContext(CookieContext) as ContextType;

  useEffect(() => {
    setLoading(true);
    if (!cookie) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_URL}api/getUserData`, {
      method: "POST",
      body: JSON.stringify({
        cookie: cookie,
      }),
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data: response) => {
          if (data.status === "success") {
            setName(data.data?.name);
            setId(data.data?.id);
            setImage(data.data?.image);
            setData(data.data?.semesterGPA);
            setCourses(data.data?.courses);

            setLoading(false);
          } else {
            setData(undefined);
            toast.error("Error: " + data.message, {
              duration: 10000,
            });
            setLoading(false);
          }
        });
      } else {
        setData(undefined);
        toast.error("Error: " + res.statusText);
        setLoading(false);
      }
    });
  }, [cookie]);

  return (
    <div className="w-full">
      {data == undefined || courses == undefined ? (
        <div className="text-red-500 animate-pulse text-4xl mx-auto text-center flex flex-col justify-center items-center">
          <AlertTriangle size={50} />
          <h1>ERROR</h1>
        </div>
      ) : loading ? (
        <Loader2 className="mx-auto h-10 w-10 animate-spin" />
      ) : (
        <div className="grid grid-cols-5 gap-3">
          <Card className="w-full col-span-5 lg:col-span-1 py-4">
            <div className="flex flex-col justify-center items-center text-center h-full">
              <Avatar className="w-24 h-24">
                <AvatarImage src={image} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>

              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{id}</CardDescription>
              </CardHeader>

              <CardContent className="bg-[#8884d8]/70 py-1 px-2 rounded-2xl">
                <h1 className="font-semibold text-sm ">
                  CGPA: {data.length > 0 && data[data.length - 1].CurrentCGPA}
                </h1>
              </CardContent>
            </div>
          </Card>

          <Chart data={data} />
          <div className="col-span-5">
            <GradesTable data={courses} />
          </div>
        </div>
      )}
    </div>
  );
}
