import React from 'react';
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
      </Head>
      

    
      <main className={styles.main}>
        <h1 className={styles.title} tabIndex={0}>Welcome to DocEase</h1>
        <div className={styles.cardContainer}>
          {/* Card 1 - Book Appointment */}
          <div className={styles.card} tabIndex={0} aria-label="Book Appointment">
            <h2>Book Appointment</h2>
            <p>Find the best doctors and book appointments instantly.</p>
            <Link href="/patient/book-appointment" legacyBehavior>
              <a className={styles.btnPrimary} tabIndex={0} aria-label="Book Now">Book Now</a>
            </Link>
          </div>

          {/* Card 2 - Login / Sign Up */}
          <div className={styles.card} tabIndex={0} aria-label="Login or Sign Up">
            <h2>Login / Sign Up</h2>
            <p>Access your dashboard or create a new account.</p>
            <div className={styles.authButtons}>
              <Link href="/login" legacyBehavior>
                <a className={styles.btnSecondary} tabIndex={0} aria-label="Login">Login</a>
              </Link>
              <Link href="/signUp" legacyBehavior>
                <a className={styles.btnSecondary} tabIndex={0} aria-label="Sign Up">Sign Up</a>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div>&copy; {new Date().getFullYear()} DocEase. All rights reserved.</div>
        <div className={styles.footerLinks}>
          <a href="/contact" tabIndex={0} aria-label="Contact Us" target="_blank" rel="noopener noreferrer">Contact Us</a>
        <Link href="/privacy-policy" legacyBehavior>
  <a className="hover:underline">Privacy Policy</a>
</Link>
          <a href="/api-docs" tabIndex={0} aria-label="API Docs" target="_blank" rel="noopener noreferrer">API Docs</a>
        </div>
        <div className={styles.socialIcons}>
          <a href="https://twitter.com/" tabIndex={0} aria-label="Twitter" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://facebook.com/" tabIndex={0} aria-label="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://linkedin.com/" tabIndex={0} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </>
  );
}
