import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(data.message || "Reset link sent! Check your email.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Error sending reset link. Try again.");
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | MyApp</title>
      </Head>

      <main className={styles.main}>
        <div
          className={styles.container}
          style={{
            width: "420px",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)", // black transparent
            padding: "30px",
          }}
        >
          <div className={styles.right} style={{ width: "100%" }}>
            <FontAwesomeIcon icon={faCircleUser} size="6x" className={styles.userIcon} />

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                className={styles.input}
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" className={styles.button}>
                Send Reset Link
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
