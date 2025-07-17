import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Signup.module.css";

// Font and Icons
import { Niconne } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faSquareXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const niconne = Niconne({
  subsets: ['latin'],
  weight: '400',
});

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState("patient");
  const router = useRouter(); // 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const { name, email, phone, password } = formData;

  if (!name || !email || !phone || !password || !role) {
    setError("Please fill in all required fields.");
    return;
  }

  try {
    const res = await fetch("/api/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData }),
    });

    const data = await res.json();
    console.log("uid",data.id);

    if (!res.ok) {
      setError(data.message || "Signup failed");
    } else {
     setSuccess("Signup successful! Redirecting you....");
      localStorage.clear();

      // Store signup data with "App" prefix
      localStorage.setItem("AppUserId", data.id);
      localStorage.setItem("AppUserName", name);
      localStorage.setItem("AppUserEmail", email);

      // Set auth method explicitly
      localStorage.setItem("authMethod", "signup");


      // localStorage.setItem("UserId", loginData.user.id);
      // localStorage.setItem("UserName", loginData.user.name);
      // localStorage.setItem("UserEmail", loginData.user.email);
      router.push("/PorD");

      // 🟢 Attempt login immediately after signup
      // const loginRes = await fetch("/api/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     email: formData.email,
      //     password: formData.password,
      //     role: role
      //   })
      // });

      // const loginData = await loginRes.json();

      // if (loginRes.ok) {
        
      // } else {
      //   setError("Signup worked, but login failed.");
      // }
    }
  } catch (err) {
    setError("Something went wrong.");
  }
};
const handleGoogleSignIn = () => {
    const selectedRole = role;

    signIn("google", {
      callbackUrl: `/PorD`,
      // state: JSON.stringify({ role: selectedRole }),
    });
  };
  const { data: session, status } = useSession();


  return (
    <>
      <Head>
        <title>Signup | MyApp</title>
        <meta name="description" content="Signup for MyApp" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          {/* FORM SIDE */}
          <div className={styles.MainRight}>
            <div className={styles.right}>
              <FontAwesomeIcon icon={faCircleUser} size="6x" className={styles.userIcon} />

              <form onSubmit={handleSubmit} className={styles.form}>
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
                </div> */}
                <input
                  className={styles.input}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className={styles.input}
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button type="submit" className={styles.button}>Sign Up</button>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>}
              </form>

              <p className={styles.link}>
                Already have an account? <Link href="/login">Login here</Link>
              </p>

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

          {/* TITLE SIDE */}
          <div className={styles.left}>
            <h1 className={`${styles.title} ${niconne.className}`}>Join Us Today....</h1>
          </div>
        </div>
      </main>
    </>
  );
}
