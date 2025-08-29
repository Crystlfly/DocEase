import React from 'react';
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import {FaTwitter,FaFacebookF,FaLinkedinIn,FaInstagram} from "react-icons/fa"
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

      {/* ---Footer-- */}
       <footer className={styles.footer}>
        <div className={styles.footerOverlay}></div>
        <div className={styles.footerTop}>
          <div className={styles.logo}>
            🏥 <span>DocEase</span>
          </div>

          <div className={styles.socialIcons}>
            <a
              href="https://twitter.com/"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.twitter}
            >
              <FaTwitter />
            </a>
            <a
              href="https://facebook.com/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.facebook}
            >
              <FaFacebookF />
            </a>
            <a
              href="https://linkedin.com/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkedin}
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://instagram.com/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagram}
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <Link href="/contact" legacyBehavior>
            <a tabIndex={0} aria-label="Contact Us" target="_blank" rel="noopener noreferrer">Contact Us</a>
          </Link>
          <Link href="/privacy-policy" legacyBehavior>
            <a>Privacy Policy</a>
          </Link>
          <Link href="/api-docs" legacyBehavior>
            <a tabIndex={0} aria-label="API Docs" target="_blank" rel="noopener noreferrer">API Docs</a>
          </Link>
        </div>

        <div className={styles.footerBottom}>
          &copy; {new Date().getFullYear()} DocEase. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
