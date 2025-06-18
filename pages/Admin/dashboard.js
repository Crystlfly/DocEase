import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/adminDash.module.css";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Home() {
  return (
    <>
      <Head>
        

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
    
      <main className={styles.main}>
        
        {/* <h1 className={styles.title}>Welcome to DocEase</h1> */}
        

        <div className={styles.cardContainer}>
          {/* Card 1 - Book Appointment */}
          <div className={styles.card}>
            <h2>Patients</h2>
            <p>Select this to see about the patients.</p>
            <Link href="/Admin/PatList" className={styles.btnPrimary}>
                <FontAwesomeIcon icon={faArrowRight} size="2x" style={{ color: "#a0d8f4" }} />
            </Link>
          </div>

          {/* Card 2 - Login / Sign Up */}
          <div className={styles.card}>
            <h2>Doctors</h2>
            <p>Select this to see about the doctors.</p>
            <div className={styles.authButtons}>
              <Link href="/Admin/DocList" className={styles.btnSecondary}>
                <FontAwesomeIcon icon={faArrowRight} size="2x" style={{ color: "#a0d8f4" }} />
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
