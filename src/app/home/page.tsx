"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, signOut, setUser } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  const handleSignOut = async () => {
    router.push("/");
    await signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-3xl">{user.displayName}</div>
      <div className="text-2xl mt-4">{user.email}</div>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}
