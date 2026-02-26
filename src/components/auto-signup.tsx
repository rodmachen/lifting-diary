"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export function AutoSignUp() {
  const searchParams = useSearchParams();
  const clerk = useClerk();

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      clerk.openSignUp();
    }
  }, [searchParams, clerk]);

  return null;
}
