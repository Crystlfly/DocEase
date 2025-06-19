import React, { useEffect, useState } from "react";
import styles from "@/styles/dashboard.module.css";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState({ today: [], upcoming: [] });
  const [totalPatients, setTotalPatients] = useState(0);
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("today");

  useEffect(() => {
    console.log("Fetching dashboard data...");
  // Ensure it's running only in the browser
  if (typeof window === "undefined") return;

  const email = localStorage.getItem("UserEmail");
  if (!email) {
    console.warn("No email found in localStorage");
    return;
  }

  const fetchDashboardData = async () => {
    try {
      console.log("Email being sent to API:", email);

      const res = await fetch("/api/doc/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setAppointments({
        today: data.todayAppointments,
        upcoming: data.upcomingAppointments,
      });
      setTotalPatients(data.totalPatients);
      setDoctorName(data.doctorName);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  fetchDashboardData();
}, []);


  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.main}>
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Welcome, Dr. {doctorName}</h1>
      </header>

      <section className={styles.statsSection}>
        <div className={styles.statCard} onClick={() => setActiveSection("today")}>
          <h2>Today's Appointments</h2>
          <p>{appointments.today?.length || 0}</p>
        </div>

        <div className={styles.statCard} onClick={() => setActiveSection("patients")}>
          <h2>Total Patients</h2>
          <p>{totalPatients}</p>
        </div>

        <div className={styles.statCard} onClick={() => setActiveSection("upcoming")}>
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

  {activeSection === "patients" && (
    totalPatients === 0 ? (
      <p>No patients found.</p>
    ) : (
      <ul className={styles.appointmentsList}>
        {[
          // Extract and display unique patients from both today + upcoming
          ...new Map(
            [...appointments.today, ...appointments.upcoming].map(appt => [
              appt.patientId?._id,
              appt.patientId
            ])
          ).values()
        ].map((patient) => (
          <li key={patient?._id || Math.random()} className={styles.appointmentItem}>
            <p><strong>Name:</strong> {patient?.name || "Unknown"}</p>
            {/* You can add more fields like email, age, etc. if needed */}
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
