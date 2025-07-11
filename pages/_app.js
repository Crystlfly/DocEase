import "@/styles/globals.css";
import '@/components/GlassIcons.css';  // Add this line
import React from 'react';
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data?.user) {
        // Fetch the actual JWT token
        const tokenRes = await fetch("/api/auth/token"); // We'll create this route
        const tokenData = await tokenRes.json();
        if (tokenData?.token) {
          localStorage.setItem("token", tokenData.token);
        }
      }
    };
    fetchToken();
  }, []);
  return( 
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
