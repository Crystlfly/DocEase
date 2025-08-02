import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import styles from "@/styles/header.module.css"; // Reuse existing styles
// import * as db from "@/db";


export default function DoctorHeader() {
  const [showProfile, setShowProfile] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [email, setEmail] = useState("");
  const [doctorData, setDoctorData] = useState({});

  useEffect(() => {
    const name = localStorage.getItem("UserName");
    const storedEmail  = localStorage.getItem("UserEmail");
    if (name) setDoctorName(name);
    if (storedEmail) setEmail(storedEmail);
    async function fetchDoctor() {
      if (!email) return;
        try {
          const res = await fetch("/api/doc/get-doctor-by-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
          });

          const data = await res.json();
          // console.log("Doctor data fetched:", data);
          if (res.ok) {
            setDoctorData(data.doctor);
          } else {
            console.error("Doctor fetch failed:", data.message);
          }
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        }
      
    }

    fetchDoctor();
  }, [email]);
  const handleLogout = () => {
    localStorage.clear();
    setShowProfile(false);
    window.location.href = "/login";
  };

  return (
    <header className={styles.header}>
      <Link href="/doctor/dashboard">
        <h1 className={styles.sideIcon}>DocEase</h1>
      </Link>

      <div className={styles.profileWrapper}>
        <FontAwesomeIcon
          icon={faCircleUser}
          size="2x"
          className={styles.userIcon}
          onClick={() => setShowProfile(!showProfile)}
        />

        {showProfile && (
          <div className={styles.profileCard}>
            
            <div className={styles.theCard}>
              <p><strong>Name:</strong> {doctorData.name}</p>
              <p><strong>Email:</strong> {doctorData.email}</p>
              <p><strong>Phone:</strong> {doctorData.phone || "N.A."}</p>
              <p><strong>Specialization:</strong> {doctorData.specialization || "N.A."}</p>
              <p><strong>Experience:</strong> {doctorData.experience || "N.A."}</p>
              <p><strong>Address:</strong> {doctorData.address || "N.A."}</p>
              <p><strong>About:</strong> {doctorData.about || "N.A."}</p>
              <button onClick={() => setShowProfile(false)}>Close</button>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </div>
            <div className={styles.cancelButtonWrapper}>
            <Link href="/doctor/complete-profile" className={styles.cancelButton}>
              <FontAwesomeIcon icon={faPen} />
            </Link>
          </div>
          </div>
        )}
      </div>
    </header>
  );
}
