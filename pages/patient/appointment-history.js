import { useEffect, useState } from "react";
import styles from "@/styles/AppointmentHistory.module.css";
import PatientHeader from "@/components/patientHeader";


export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const patientId = localStorage.getItem("UserId");
      console.log("🧠 [Client] Retrieved patientId from localStorage:", patientId);

      if (!patientId) {
        console.warn("⚠️ [Client] No patientId found in localStorage.");
        return;
      }

      try {
        console.log("📤 [Client] Sending request to fetch appointments...");
        const res = await fetch("/api/appointment/get-patient-appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId }),
        });

        const data = await res.json();
        console.log("📥 [Client] Received response:", data);

        if (res.ok) {
          console.log(`✅ [Client] Appointments fetched successfully: ${data.formatted.length}`);
          setAppointments(data.formatted || []);
        } else {
          console.error("❌ [Client] Failed to fetch appointments - non-200 response");
          setAppointments([]);
        }
      } catch (error) {
        console.error("🔥 [Client] Error while fetching appointments:", error.message);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    console.log("🛑 [Client] Initiating cancel for appointment ID:", appointmentId);
    try {
      const res = await fetch("/api/appointment/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });

      const result = await res.json();
      console.log("📥 [Client] Cancel API response:", result);

      if (res.ok) {
        console.log("✅ [Client] Appointment cancelled successfully");
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId ? { ...a, status: "cancelled" } : a
          )
        );
      } else {
        console.error("❌ [Client] Failed to cancel appointment - non-200 response");
      }
    } catch (err) {
      console.error("🔥 [Client] Error while cancelling appointment:", err.message);
    }
  };

  return (
    <div className={styles.main}>
      <PatientHeader />
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
                    console.log("⚠️ [Client] Cancel button clicked for appointment:", a._id);
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
                    console.log("✅ [Client] User confirmed cancellation");
                    handleCancel(selectedAppointmentId);
                    setShowConfirm(false);
                  }}
                >
                  Yes, Cancel
                </button>
                <button
                  className={styles.noBtn}
                  onClick={() => {
                    console.log("❎ [Client] User canceled the confirmation prompt");
                    setShowConfirm(false);
                  }}
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
