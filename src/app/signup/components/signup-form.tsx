
"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth, useFirestore } from "@/firebase"
import { createUserWithEmailAndPassword, updateProfile, AuthError } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export function SignupForm() {
    const router = useRouter();
    const auth = useAuth();
    const firestore = useFirestore();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null);
        if (!auth || !firestore) return;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            const fullName = `${values.firstName} ${values.lastName}`;

            await updateProfile(user, {
                displayName: fullName,
            });

            // Save to /users collection
            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
            });

            // Save to /technicians collection
            const technicianDocRef = doc(firestore, 'technicians', user.uid);
            await setDoc(technicianDocRef, {
                name: fullName,
                role: "Team Member",
            });


            router.push("/dashboard");

        } catch (e) {
             const authError = e as AuthError;
             switch (authError.code) {
                 case "auth/email-already-in-use":
                    setError("This email address is already in use.");
                    break;
                 case "auth/weak-password":
                    setError("The password is too weak. Please use at least 8 characters.");
                    break;
                 default:
                    setError("An unexpected error occurred. Please try again.");
                    break;
             }
        }
    }

    return (
        <Form {...form}>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Signup Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="name@example.com" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full !mt-6 text-base font-bold">
                    Create Account
                </Button>
            </form>
        </Form>
    )
}
