// pages/redirect.js
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user) {
      router.replace("/login");
      return;
    }
    const roles = session.user.roles || [];

    if (roles.length === 0) {
      router.replace("/unauthorized");
    } else if (roles.length === 1) {
      const role = roles[0];
      console.log("role found",role);
      if (role === "doctor") router.replace("/doctor/dashboard");
      else if (role === "patient") router.replace("/patient/dashboard");
      else if (role === "admin") router.replace("/admin/dashboard");
    //   else router.replace("/unauthorized");
    } else {
      // If multiple roles (e.g. both patient and doctor), show role selector
      router.replace("/PorD");
    }
  }, [session, status]);

  return <p>🔄 Redirecting...</p>;
}
