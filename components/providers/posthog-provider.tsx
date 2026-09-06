"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (posthogKey && typeof window !== "undefined") {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false, // Handled dynamically below
        capture_pageleave: true,
        autocapture: false,
      });

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
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
        path: pathname,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
