// ⬇️ Add this at the very top
console.log("🟢 [LoginPage] Component Loaded");

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect  } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Login.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Niconne } from 'next/font/google';
import { dbLogger } from "@/lib/dbLogger";


const niconne = Niconne({
  subsets: ['latin'],
  weight: '400',
});

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔵 [Login Attempt] Email:", email);
    await dbLogger("info", "Login attempt", { email });
    setErrorMsg("");

    try {
      

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("🟡 [Login Response]:", data);

      // if(res.status===403){
      //   router.push("/PorD")
      // }

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("UserName", data.user.name);
        // localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("UserEmail", data.user.email);
        localStorage.setItem("UserId", data.user.id);
        localStorage.setItem("token", data.user.token); // Store JWT token
        localStorage.setItem("userRoles", JSON.stringify(data.user.roles));

        console.log("✅ [Login Success] LocalStorage populated");
        await dbLogger("info", "Login successful", { email });
        const roles = data.user.roles;
        console.log("roles: ",roles)
        if (roles.length === 1) {
          const onlyRole = roles[0];

          if (onlyRole === "doctor") {
            // if (data.user.profileCompleted === false) {
            //   console.log("🛠️ Doctor profile not completed. Redirecting...");
            //   router.push("/doctor/complete-profile");
            //   return;
            // }
            router.push("/doctor/dashboard");
          } else if (onlyRole === "patient") {
            router.push("/patient/dashboard");
          } else if (onlyRole === "admin") {
            router.push("/Admin/dashboard");
          } else {
            console.warn("⚠️ Unknown role received:", onlyRole);
            setErrorMsg("Unknown user role");
          }

        } else if (roles.length > 1) {
          // 🔁 More than one role → show pord page
          console.log("🔄 Multiple roles detected. Redirecting to pord...");
          router.push("/PorD");
        }
      } else {
        console.error("❌ Login failed:", data.message);
        await dbLogger("error", "Login failed", { email, role, error: data.message });
        setErrorMsg(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("🔥 [Login Error]:", err.message);
      await dbLogger("error", "Login API error", { email,  error: err.message });
      setErrorMsg("Login failed. Please try again.");
    }
  };
  const handleGoogleSignIn = () => {
    const selectedRole = role;

    signIn("google", {
      callbackUrl: `/redirect`,
      // state: JSON.stringify({ role: selectedRole }),
    });
  };
  const { data: session, status } = useSession();

useEffect(() => {
  if (status === "authenticated" && session?.user) {
    if (!localStorage.getItem("UserId")) {
      localStorage.setItem("user", JSON.stringify(session.user));
      localStorage.setItem("UserName", session.user.name || "");
      localStorage.setItem("UserEmail", session.user.email || "");
      localStorage.setItem("UserId", session.user._id || "");
      localStorage.setItem("userRole", session.user.role || "");
    }

    console.log("✅ [Google Login] Stored in localStorage:", session.user);
  }
}, [session, status]);

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
                {/* <div className={styles.radioGroup}>
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
                </div> */}

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
              <button
                onClick={() => {
                  if (!role) {
                    alert("Please select a role first!");
                    return;
                  }
                  handleGoogleSignIn();
                }}
                className={styles.socialBtn}
              >
                <FontAwesomeIcon icon={faGoogle} size="2x" style={{ color: "#a0d8f4" }} />
              </button>
              <FontAwesomeIcon icon={faFacebook} size="2x" style={{ marginBottom: "20px", color: "#a0d8f4" }} />
              <FontAwesomeIcon icon={faSquareXTwitter} size="2x" style={{ marginBottom: "20px", color: "#a0d8f4" }} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
