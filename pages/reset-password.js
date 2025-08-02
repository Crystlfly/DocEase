// pages/reset-password.jsx

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    // if (!token) {
    //   setError("Missing reset token.");
    //   return;
    // }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password | MyApp</title>
      </Head>

      <main className={styles.main}>
        <div
          className={styles.container}
          style={{
            width: "420px",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: "30px",
          }}
        >
          <div className={styles.right} style={{ width: "100%" }}>
            <FontAwesomeIcon icon={faCircleUser} size="6x" className={styles.userIcon} />

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="password"
                className={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {status && <p className={styles.link}>{status}</p>}
              {error && <p className={styles.error}>{error}</p>}
            </form>

            <p className={styles.link}>
              Remembered your password? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
