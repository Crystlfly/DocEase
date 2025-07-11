import { useEffect, useState} from "react";
import styles from "@/styles/PatientLanding.module.css";
import Link from "next/link";

import PatientHeader from "@/components/patientHeader";
export default function PatientLandingPage() {
  const [patientName, setPatientName] = useState("");
  // const [patientId, setPatientId] = useState("");
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    const name = localStorage.getItem("UserName");
    const id = localStorage.getItem("UserId");
    if(name && id) {
      setPatientName(name);
      // setPatientId(id);
    }
    setLoaded(true);
  }, []);
  
  return (
    <div className={styles.background}>
      <div className={`${styles.container} ${loaded ? styles.fadeIn : ""}`}>
      <PatientHeader />
        <h1 className={styles.welcome}>Welcome{patientName ? `, ${patientName}` : ""}!</h1>
        <div className={styles.cardContainer}>
          <Link href="/patient/book-appointment" className={styles.card}>
            <h2>Book Appointment</h2>
            <p>Choose your doctor and schedule a visit.</p>
          </Link>
          <Link href="/patient/appointment-history" className={styles.card}>
            <h2>My Appointments</h2>
            <p>View your upcoming and past appointments.</p>
          </Link>
          {/* <Link href="/login" className={styles.card}>
            <h2>Logout</h2>
            <p>Sign out of your account.</p>
          </Link> */}
        </div>
      </div>
      </div>
  );
}
