"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/firebase";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SignupForm } from "./components/signup-form";

export default function SignupPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Image
          src="/images/icon.png"
          alt="Loading"
          width={48}
          height={148}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-full items-center justify-center">
                <Image src="/images/logo.png" alt="ForgeLabs" width={100} height={100} className="h-full w-auto object-contain" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Create an Account
            </CardTitle>
            <CardDescription>
              Enter your details below to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
          <CardFooter className="flex-col !pb-6 !pt-2">
            <div className="text-center text-sm text-muted-foreground w-full flex items-center gap-2">
              <Separator className="shrink" />
              <span className="shrink-0">or</span>
              <Separator className="shrink" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
