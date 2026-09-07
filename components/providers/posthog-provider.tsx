"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isClientInitialized, setIsClientInitialized] = useState(false);

  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (posthogKey && typeof window !== "undefined") {
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: "identified_only",
          capture_pageview: false, // Handled dynamically below
          capture_pageleave: true,
          autocapture: false,
          loaded: () => {
            setIsClientInitialized(true);
          },
        });

        setIsClientInitialized(true);

        // Bind Supabase Auth state changes to PostHog User Identification
        if (isSupabaseConfigured()) {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              posthog.identify(session.user.id, {
                email: session.user.email,
                last_sign_in: new Date().toISOString(),
              });
            } else if (event === "SIGNED_OUT") {
              posthog.reset();
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        }
      } catch (err) {
        console.debug("[PostHog] Initialization fallback:", err);
      }
    }
  }, []);

  // If PostHog key is not configured or in development without key, safely render children directly
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      {isClientInitialized && <PostHogPageView />}
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined" && posthog.__loaded) {
      try {
        let url = window.origin + pathname;
        if (searchParams && searchParams.toString()) {
          url = `${url}?${searchParams.toString()}`;
        }
        posthog.capture("$pageview", {
          $current_url: url,
          path: pathname,
        });
      } catch (e) {
        console.debug("[PostHog] PageView capture warning:", e);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

