import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

import { signIn } from "next-auth/react";
import { Niconne } from 'next/font/google';

const niconne = Niconne({
  subsets: ['latin'],
  weight: '400',
});

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();
    console.log("USER OBJECT:", data);

    if (res.ok) {
      alert("Login successful!");
      localStorage.setItem("UserName", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("UserEmail", data.user.email);
      localStorage.setItem("UserId", data.user.id);

      if (data.user.role.toLowerCase() === "doctor") {
        if (data.user.profileCompleted === false) {
          router.push("/doctor/complete-profile");
          return;
        }
        console.log("page routed successfully");
        router.push("/doctor/dashboard");
      } else if (data.user.role.toLowerCase() === "patient") {
        router.push("/patient/dashboard");
      } else if (data.user.role.toLowerCase() === "admin") {
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("Unknown user role");
      }
    } else {
      setErrorMsg(data.message || "Something went wrong");
    }
  };

  return (
    <>
      <Head>
        <title>Login | MyApp</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.left}>
            <h1 className={`${styles.title} ${niconne.className}`}>Let's Get Started...</h1>
          </div>

          <div className={styles.MainRight}>
            <div className={styles.right}>
              <FontAwesomeIcon icon={faCircleUser} size="6x" className={styles.userIcon} />

              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.radioGroup}>
                  <label className={styles.customradio}>
                    <input
                      type="radio"
                      name="role"
                      value="doctor"
                      checked={role === "doctor"}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    Doctor
                  </label>
                  <label className={styles.customradio}>
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={role === "patient"}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    Patient
                  </label>
                  <label className={styles.customradio}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === "admin"}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    Admin
                  </label>
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />

                <button type="submit" className={styles.button}>Login</button>

                {errorMsg && <p className={styles.error}>{errorMsg}</p>}
              </form>

              <p className={styles.link}>
                Don't have an account? <Link href="/signUp">Sign up</Link>
              </p>
            </div>

            <div className={styles.verticalLine}></div>

            <div className={styles.rightLogin}>
              <button onClick={() => signIn("google")} className={styles.socialBtn}>
                <FontAwesomeIcon icon={faGoogle} size="2x" style={{ color: "#a0d8f4" }} />
              </button>

              <button onClick={() => signIn("facebook")} className={styles.socialBtn}>
                <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: "#a0d8f4" }} />
              </button>

              <button onClick={() => signIn("twitter")} className={styles.socialBtn}>
                <FontAwesomeIcon icon={faSquareXTwitter} size="2x" style={{ color: "#a0d8f4" }} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
