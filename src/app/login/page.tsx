
"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } catch (e) {
        const authError = e as AuthError;
        switch (authError.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setError("Invalid email or password. Please try again.");
            break;
          default:
            setError("An unexpected error occurred. Please try again later.");
            break;
        }
      }
    }
  };

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || (!isUserLoading && user)) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Image src="/images/icon.png" alt="Loading" width={48} height={48} className="animate-spin" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-full items-center justify-center">
              <Image src="/images/logo.png" alt="ForgeLabs" width={200} height={200} className="h-full w-auto object-contain" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Please enter your details to sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full !mt-6 text-base font-bold">
                Sign In
              </Button>
            </form>
          </CardContent>
           <CardFooter className="flex-col !pb-6 !pt-2">
            <div className="text-center text-sm text-muted-foreground w-full flex items-center gap-2">
                <Separator className="shrink" />
                <span className="shrink-0">or</span>
                <Separator className="shrink" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </p>
           </CardFooter>
        </Card>
      </div>
    </div>
  );
}
