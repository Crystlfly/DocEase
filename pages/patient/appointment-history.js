import { useEffect, useState } from "react";
import styles from "@/styles/AppointmentHistory.module.css";

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const patientId = localStorage.getItem("UserId");
      if (!patientId) return;

      try {
        const res = await fetch("/api/appointment/get-patient-appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId }),
        });

        const data = await res.json();
        if (res.ok) {
          setAppointments(data.formatted || []);
        } else {
          console.error("Failed to fetch appointments");
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    const res = await fetch("/api/appointment/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId }),
    });

    if (res.ok) {
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: "cancelled" } : a
        )
      );
    } else {
      console.error("Failed to cancel appointment");
    }
  };

  return (
    <div className={styles.main}>
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Appointment History</h2>

      {appointments.length === 0 ? (
        <p className={styles.noAppointments}>No appointments found.</p>
      ) : (
        appointments.map((a) => (
          <div key={a._id} className={styles.card}>
  <p>
    <span className={styles.label}>Doctor:</span>{" "}
    <span className={styles.value}>
      {a.doctorName || a.doctorId?.name || "Unknown Doctor"}
    </span>
  </p>
  <p>
    <span className={styles.label}>Date:</span>{" "}
    <span className={styles.value}>{a.date}</span>
    &nbsp;|&nbsp;
    <span className={styles.label}>Time:</span>{" "}
    <span className={styles.value}>{a.time}</span>
  </p>
  <p>
    <span className={styles.label}>Status:</span>{" "}
    <span className={`${styles.value} ${styles[a.status]}`}>{a.status}</span>
  </p>
  {a.status === "upcoming" && (
    <button
      className={styles.cancelBtn}
      onClick={() => {
        setSelectedAppointmentId(a._id);
        setShowConfirm(true);
      }}
    >
      Cancel Appointment
    </button>
  )}
</div>

        ))
      )}

      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p>Are you sure you want to cancel this appointment?</p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.yesBtn}
                onClick={() => {
                  handleCancel(selectedAppointmentId);
                  setShowConfirm(false);
                }}
              >
                Yes, Cancel
              </button>
              <button
                className={styles.noBtn}
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
