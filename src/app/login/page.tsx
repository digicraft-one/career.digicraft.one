"use client";

import { LoginFormSkeleton } from "@/components/skeletons";
import DigiCraftLogo from "@/components/shared/DigiCraftLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Lock, User } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/admin");
        }
    }, [status, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
        });

        if (res?.error) {
            setError("Invalid credentials.");
            setLoading(false);
        } else {
            router.push("/admin");
        }
    }

    if (status === "loading" || status === "authenticated") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
                <LoginFormSkeleton />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
            <Card className="relative w-full max-w-md overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
                {loading && (
                    <div
                        className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px]"
                        aria-hidden
                    />
                )}
                <CardHeader className="pb-6 text-center">
                    <div className="mx-auto mb-4 w-fit">
                        <DigiCraftLogo size={56} priority />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        Careers Admin
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                        Sign in to manage jobs and applications
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
