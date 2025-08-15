import React from 'react'; // ✅ required
import Link from "next/link";
import styles from "@/styles/PatientHeader.module.css"; // Reuse existing styles



export default function GuestHeader() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <h1 className={styles.sideIcon}>DocEase</h1>
      </Link>

    </header>
  );
}
