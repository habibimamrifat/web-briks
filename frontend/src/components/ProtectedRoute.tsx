"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/util/getAuthToken";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const accessToken = getAuthToken("access");

    if (!accessToken) {
      router.replace("/");
      return;
    }

    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}