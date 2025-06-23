// pages/Admin/index.js or wherever your Home component is

import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/adminDash.module.css";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { dbLogger } from "@/lib/dbLogger";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Server-side logging
export async function getServerSideProps() {
  await dbLogger("info", "Admin Dashboard accessed");
  return { props: {} };
}

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2>Logs</h2>
            <p>Select this to see the logs.</p>
            <Link href="/Admin/LogList" className={styles.btnPrimary}>
              <FontAwesomeIcon icon={faArrowRight} size="2x" style={{ color: "#a0d8f4" }} />
            </Link>
          </div>

          <div className={styles.card}>
            <h2>Patients</h2>
            <p>Select this to see about the patients.</p>
            <Link href="/Admin/PatList" className={styles.btnPrimary}>
              <FontAwesomeIcon icon={faArrowRight} size="2x" style={{ color: "#a0d8f4" }} />
            </Link>
          </div>

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
