import React from 'react'; // ✅ required

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import styles from "@/styles/PatientHeader.module.css"; // Reuse existing styles
import { faUserInjured } from '@fortawesome/free-solid-svg-icons';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';
import Router from "next/router";


export default function PatientHeader() {
  const [showProfile, setShowProfile] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("UserName");
    const email = localStorage.getItem("UserEmail");
    if (name) setPatientName(name);
    if (email) setEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setShowProfile(false);
    window.location.href = "/login";
  };

  const registerDoctor = () => {
    const rolesRaw=localStorage.getItem("userRoles");
    if(rolesRaw.includes("doctor")) {
      Router.push("/doctor/dashboard");
    }
    else{
      Router.push("/PorD")

    }
  };

  return (
    <header className={styles.header}>
      <Link href="/patient/dashboard">
        <h1 className={styles.sideIcon}>DocEase</h1>
      </Link>

      <div className={styles.profileWrapper}>
        <FontAwesomeIcon icon={faUserInjured} size="2x" className={styles.userIcon} title="Patient" onClick={() => Router.push("/patient/dashboard")}/>
        <FontAwesomeIcon icon={faStethoscope} size="2x" className={styles.userIcon} title="Doctor" onClick={() => registerDoctor()}/>
        <FontAwesomeIcon
          icon={faCircleUser}
          size="2x"
          className={styles.userIcon}
          onClick={() => setShowProfile(!showProfile)}
        />

        {showProfile && (
          <div className={styles.profileCard}>
            <p><strong>Name:</strong> {patientName}</p>
            <p><strong>Email:</strong> {email}</p>
            <button onClick={() => setShowProfile(false)}>Close</button>
            <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
