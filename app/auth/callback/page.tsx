"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");

      if (!accessToken || !refreshToken) {
        window.location.href = "/login";
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${apiUrl}/users/${payload.userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const user = await res.json();
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Failed to save OAuth user", error);
      }

      window.location.href = "/";
    };

    run();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Signing you in...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
