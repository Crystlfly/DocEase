import React, { useEffect, useState } from "react";
import styles from "@/styles/dashboard.module.css";

export default function DoctorDashboard() {
  console.log("🟢 [DoctorDashboard] Component mounted");

  const [appointments, setAppointments] = useState({ today: [], upcoming: [] });
  const [totalPatients, setTotalPatients] = useState(0);
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("today");

  useEffect(() => {
    console.log("📡 [DoctorDashboard] useEffect triggered");

    if (typeof window === "undefined") {
      console.warn("🚫 Not in browser environment");
      return;
    }

    const email = localStorage.getItem("UserEmail");
    if (!email) {
      console.warn("⚠️ No email found in localStorage");
      return;
    }

    console.log("📨 Email from localStorage:", email);

    const fetchDashboardData = async () => {
      try {
        console.log("🚀 Sending POST to /api/doc/dashboard");

        const res = await fetch("/api/doc/dashboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        console.log("📬 API response received:", data);

        setAppointments({
          today: data.todayAppointments,
          upcoming: data.upcomingAppointments,
        });
        setTotalPatients(data.totalPatients);
        setDoctorName(data.doctorName);
        setLoading(false);

        console.log("✅ Dashboard state updated");
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    console.log("⏳ Waiting for data...");
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <h1>Welcome, Dr. {doctorName}</h1>
        </header>

        <section className={styles.statsSection}>
          <div
            className={styles.statCard}
            onClick={() => {
              console.log("🖱️ Switched to section: today");
              setActiveSection("today");
            }}
          >
            <h2>Today's Appointments</h2>
            <p>{appointments.today?.length || 0}</p>
          </div>

          <div
            className={styles.statCard}
            onClick={() => {
              console.log("🖱️ Switched to section: patients");
              setActiveSection("patients");
            }}
          >
            <h2>Total Patients</h2>
            <p>{totalPatients}</p>
          </div>

          <div
            className={styles.statCard}
            onClick={() => {
              console.log("🖱️ Switched to section: upcoming");
              setActiveSection("upcoming");
            }}
          >
            <h2>Upcoming Appointments</h2>
            <p>{appointments.upcoming?.length || 0}</p>
          </div>
        </section>

        <section className={styles.appointmentsSection}>
          <h2>
            {activeSection === "today" && "Today's Appointments Details"}
            {activeSection === "upcoming" && "Upcoming Appointments Details"}
            {activeSection === "patients" && "All Patients List"}
          </h2>

          {/* TODAY */}
          {activeSection === "today" && (
            appointments.today.length === 0 ? (
              <p>No appointments for today.</p>
            ) : (
              <ul className={styles.appointmentsList}>
                {appointments.today.map((appt) => (
                  <li key={appt._id} className={styles.appointmentItem}>
                    <p><strong>Patient:</strong> {appt.patientId?.name || "Unknown"}</p>
                    <p><strong>Date & Time:</strong> {new Date(`${appt.date} ${appt.time}`).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}</p>
                    <p><strong>Reason:</strong> {appt.reason}</p>
                  </li>
                ))}
              </ul>
            )
          )}

          {/* UPCOMING */}
          {activeSection === "upcoming" && (
            appointments.upcoming.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <ul className={styles.appointmentsList}>
                {appointments.upcoming.map((appt) => (
                  <li key={appt._id} className={styles.appointmentItem}>
                    <p><strong>Patient:</strong> {appt.patientId?.name || "Unknown"}</p>
                    <p><strong>Date & Time:</strong> {new Date(`${appt.date} ${appt.time}`).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}</p>
                    <p><strong>Reason:</strong> {appt.reason}</p>
                  </li>
                ))}
              </ul>
            )
          )}

          {/* PATIENT LIST */}
          {activeSection === "patients" && (
            totalPatients === 0 ? (
              <p>No patients found.</p>
            ) : (
              <ul className={styles.appointmentsList}>
                {[
                  ...new Map(
                    [...appointments.today, ...appointments.upcoming].map(appt => [
                      appt.patientId?._id,
                      appt.patientId
                    ])
                  ).values()
                ].map((patient) => (
                  <li key={patient?._id || Math.random()} className={styles.appointmentItem}>
                    <p><strong>Name:</strong> {patient?.name || "Unknown"}</p>
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
      </div>
    </div>
  );
}
