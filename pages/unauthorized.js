// pages/unauthorized.js

import React from "react";
import Link from "next/link";
import styles from "@/styles/unauthorized.module.css";

export default function UnauthorizedPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🚫 Unauthorized Access</h1>
        <p className={styles.description}>You do not have permission to view this page.</p>
        <Link href="/">
          <button className={styles.homeButton}>Return to Home</button>
        </Link>
      </div>
    </div>
  );
}
