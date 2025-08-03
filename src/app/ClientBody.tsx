/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/useAuthStore";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeAuth }: any = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
