"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContextType, UserContext } from "./context/UserContext";

const formSchema = z.object({
  ID: z.string().min(8, {
    message: "ID must be at least 8 characters.",
  }),
  password: z.string().min(1, {
    message: "Please enter your password.",
  }),
});

const LoginForm = () => {
  const { user, setUser } = useContext(UserContext) as ContextType;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ID: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}api/login`, {
      method: "POST",
      body: JSON.stringify({
        ID: values.ID,
        Pass: values.password,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      if (data.status === "success") {
        setUser(true);
        router.push("/");
      } else {
        toast.error("Incorrect username or password");
      }
    } else {
      toast.error("Error: " + res.statusText);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-10">
      <div className="pb-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          Start tracking your CGPA
        </h1>
        <h1 className="text-lg font-medium text-center mb-2">
          Login with your <span className="text-red-600">CUB</span> UMS
          credentials
        </h1>
        <p className="text-center text-muted-foreground">
          Your ID and password are not stored.
        </p>
        <Link
          target="_blank"
          href="https://github.com/christosuster/CUB-CGPA-Tracker"
          className="flex justify-center hover:text-white hover:animate-none leading-3 items-center  gap-2 underline  underline-offset-2 text-muted-foreground animate-pulse"
        >
          Checkout how it works
        </Link>
      </div>
      <Form {...form}>
        <form
          autoComplete="on"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="ID"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant={"secondary"}
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading" : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
