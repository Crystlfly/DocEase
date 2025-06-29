import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to DocEase</title>
        <meta name="description" content="Easily book appointments with trusted doctors" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
      </Head>
      <df-messenger
  intent="WELCOME"
  chat-title="DocEase Assistant"
  agent-id="eece573a-2c85-43f0-9074-9a7f503025ff"
  language-code="en"
  background-color="#eef7fa"
  chat-icon="/docbot.png"
  user-chat-color="#cde7f5"
  bot-chat-color="#e6f2f9"
  text-color="#333"
  font-family="Segoe UI"
></df-messenger>

    
      <main className={styles.main}>
        {/* <button className={styles.btnPrimary}>
          <Link href="/Admin/DocList">Admin</Link>
        </button> */}
        <h1 className={styles.title}>Welcome to DocEase</h1>
        {/* <Chatbot /> */}

        <div className={styles.cardContainer}>
          {/* Card 1 - Book Appointment */}
          <div className={styles.card}>
            <h2>Book Appointment</h2>
            <p>Find the best doctors and book appointments instantly.</p>
            <Link href="/patient/book-appointment" className={styles.btnPrimary}>
              Book Now
            </Link>
          </div>

          {/* Card 2 - Login / Sign Up */}
          <div className={styles.card}>
            <h2>Login / Sign Up</h2>
            <p>Access your dashboard or create a new account.</p>
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.btnSecondary}>
                Login
              </Link>
              <Link href="/signUp" className={styles.btnSecondary}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} DocEase. All rights reserved.
      </footer>
    </>
  );
}
