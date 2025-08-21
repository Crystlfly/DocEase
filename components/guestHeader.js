import React from 'react'; 
import Link from "next/link";
import styles from "@/styles/PatientHeader.module.css"; 



export default function GuestHeader() {
  return (
    <header className={styles.header}>
      <Link href="http://localhost:3000">
        <h1 className={styles.sideIcon}>DocEase</h1>
      </Link>

    </header>
  );
}
