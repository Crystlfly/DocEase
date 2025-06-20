import React, { useState, useEffect } from "react";
import styles from "@/styles/BookAppointment.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";

const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM"
];

function convertTo24Hour(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientId, setPatientId] = React.useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);


  // ✅ Correctly fetch doctors on first render
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const id= localStorage.getItem("UserId");
        if (id) {
          setPatientId(id);
        }
        const res = await fetch("/api/doc/list-doc"); // Your actual API route
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
  const fetchBookedSlots = async () => {
    if (!selectedDoctor || !date) return;

    try {
      const res = await fetch("/api/appointment/get-booked-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ doctorId: selectedDoctor._id, date })
      });

      const data = await res.json();
      if (res.ok) {
        setBookedSlots(data.bookedSlots || []);
      } else {
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch booked slots:", err);
    }
  };

  fetchBookedSlots();
}, [selectedDoctor, date]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedDoctor || !date || !time || !reason) {
      alert("Please fill all fields.");
      return;
    }

    const appointmentData = {
      doctorId: selectedDoctor._id,
      patientId: patientId, // Replace with real patient ID
      date,
      time,
      reason,
      status: "upcoming"
    };
    // Here you would typically send the appointmentData to your backend API
    try {
      const response=await fetch("/api/appointment/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appointmentData)
      });
      
      if(response.ok){
        console.log("Booking appointment:", appointmentData);
        setSuccess("Appointment booked!");
        setDate("");
        setTime("");
        setReason("");
        setSelectedDoctor(null);
      }else{
        setError("Failed to book appointment. Please try again.");
      }
    }catch (error) {
        console.error("Error booking appointment:", error);
        setError("An error occurred while booking the appointment.");
      } };

  return (
    <div className={styles.container}>
      {!selectedDoctor ? (
        <div className={styles.fullWidthDoctorList}>
          <h2 className={styles.title}>Available Doctors</h2>
          <div className={styles.cardGrid}>
            {doctors.map((doc) => (
              <div
                key={doc._id}
                className={styles.card}
                onClick={() => setSelectedDoctor(doc)}
              >
                <div className={styles.doctorImage}>
                  {doc.profileImage ? (
                    <img src={doc.profileImage} alt="Doctor" />
                  ) : (
                    <FontAwesomeIcon icon={faUserDoctor} size="6x" className={styles.userIcon} />
                  )}
                </div>

                  <h3 className={styles.doctorName}>{"Dr. " + doc.name}</h3>
                  <p>
                    <span className={styles.key}>Specialization:</span>{" "}
                    <span className={styles.value}>{doc.specialization || "N.A."}</span>
                  </p>
                  <p>
                    <span className={styles.key}>Experience:</span>{" "}
                    <span className={styles.value}>{doc.experience || "N.A."}</span>
                  </p>
                  <p>
                    <span className={styles.key}>Address:</span>{" "}
                    <span className={styles.value}>{doc.address || "N.A."}</span>
                  </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.flexWrapper}>
          <div className={styles.leftPane}>
            <h2 className={styles.title}>Available Doctors</h2>
            <div className={styles.cardGrid}>
              {doctors.map((doc) => (
                <div
                  key={doc._id}
                  className={`${styles.card} ${
                    selectedDoctor && selectedDoctor._id === doc._id ? styles.selectedCard : ""
                  }`}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  <div className={styles.doctorImage}>
                    {doc.profileImage ? (
                      <img src={doc.profileImage} alt="Doctor" />
                    ) : (
                      <FontAwesomeIcon icon={faUserDoctor} size="6x" className={styles.userIcon} />
                    )}
                  </div>
                  <h3 className={styles.doctorName}>{"Dr. " + doc.name}</h3>
                  <p>
                    <span className={styles.key}>Specialization:</span>{" "}
                    <span className={styles.value}>{doc.specialization || "N.A."}</span>
                  </p>
                  <p>
                    <span className={styles.key}>Experience:</span>{" "}
                    <span className={styles.value}>{doc.experience || "N.A."}</span>
                  </p>
                  <p>
                    <span className={styles.key}>Address:</span>{" "}
                    <span className={styles.value}>{doc.address || "N.A."}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.rightPane}>
            <div className={styles.formContainer}>
              <h3 className={styles.formTitle}>Book Appointment with </h3>
              <h3 className={styles.doctorNameForm}>Dr. {selectedDoctor.name}</h3>

              <div className={styles.formGroup}>
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} 
                min={new Date().toISOString().split("T")[0]} />
              </div>

              <div className={styles.formGroup}>
                <label>Time Slot:</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="">Select</option>
                  {timeSlots.map((slot) => {
                    const slot24 = convertTo24Hour(slot); // Convert to 24-hour
                    const currentTime = new Date().toTimeString().slice(0, 5);
                    const isPast = date === new Date().toISOString().split("T")[0] && slot24 < currentTime;
                    const isDisabled = bookedSlots.includes(slot) || isPast;

                  return (
                    <option key={slot} value={slot} disabled={isDisabled}>
                      {slot} {bookedSlots.includes(slot) ? " (Booked)" : ""}
                      {/* {isPast ? " (Past)" : ""} */}
                    </option>
                  );
                  })}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Reason:</label>
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>

              <button className={styles.button} onClick={handleSubmit}>
                Book Appointment
              </button>
              {success && <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
