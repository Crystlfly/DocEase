import React, { useState, useEffect } from "react";
import styles from "@/styles/BookAppointment.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PatientHeader from "@/components/patientHeader";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientId, setPatientId] = React.useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const filteredDoctors = doctors.filter((doc) => {
  const term = searchTerm.toLowerCase();
  return (
    doc.name?.toLowerCase().includes(term) ||
    doc.specialization?.toLowerCase().includes(term) ||
    doc.address?.toLowerCase().includes(term)
  );
});

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
    const fetchAvailableSlots = async () => {
      if (!selectedDoctor || !date) return;

      try {
        const res = await fetch("/api/appointment/get-available-slots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ doctorId: selectedDoctor._id, date })
        });

        const data = await res.json();
        if (res.ok) {
          setAvailableSlots(data.availableSlots || []);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch available slots:", err);
      }
    };

    fetchAvailableSlots();
  }, [selectedDoctor, date]);





  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedDoctor || !date || !time || !reason) {
      setError("Please fill all fields."); 
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
      const data = await response.json(); // ✅ Extract response body
      if(response.ok){
        console.log("Booking appointment:", appointmentData);
        setSuccess("Appointment booked!");
        setAppointmentDetails({
    ...appointmentData,
    _id: data.appointmentID });
      setTimeout(() => {
    setSelectedDoctor(null);
  }, 2000);
        setDate("");
        setTime("");
        setReason("");

      }else{
        setError("Failed to book appointment. Please try again.");
      }
    }catch (error) {
        console.error("Error booking appointment:", error);
        setError("An error occurred while booking the appointment.");
      } };

  return (
    <div className={styles.container}>
      <PatientHeader />
      {!selectedDoctor ? (
        <div className={styles.searchBar}>
  <input
    type="text"
    placeholder="Search by name, specialization or address"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className={styles.searchInput}
  />

        <div className={styles.fullWidthDoctorList}>
          
          <h2 className={styles.title}>Available Doctors</h2>
          <div className={styles.cardGrid}>
{filteredDoctors.map((doc) => (
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
        </div>
        
      ) : (
        <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by name, specialization or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          
        
        <div className={styles.flexWrapper}>
          
          <div className={styles.leftPane}>
            <h2 className={styles.title}>Available Doctors</h2>
            <div className={styles.cardGrid}>
{filteredDoctors.map((doc) => (
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
              
              <div className={styles.theForm}>
                <h3 className={styles.formTitle}>Book Appointment with </h3>
                <h3 className={styles.doctorNameForm}>Dr. {selectedDoctor.name}</h3>

                <div className={styles.formGroup}>
                  <label htmlFor="datee" className={styles.inputPos}>Date:</label>
                  <input id="datee" type="date" value={date} onChange={(e) => setDate(e.target.value)} 
                  min={new Date().toISOString().split("T")[0]} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="timee" className={styles.inputPos}>Time Slot:</label>
                  <select id="timee" value={time} onChange={(e) => setTime(e.target.value)}>
                    <option value="">Select</option>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => {
                        const slot24 = convertTo24Hour(slot); // e.g., "14:00"
                        const currentTime = new Date().toTimeString().slice(0, 5); // e.g., "13:25"
                        const isToday = date === new Date().toISOString().split("T")[0];
                        const isPast = isToday && slot24 < currentTime;
                        return (
                          <option key={slot} value={slot} disabled={isPast}>
                            {slot}
                          </option>
                        );
                      })
                    ) : (
                      <option disabled>No slots available</option>
                    )}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reasonn" className={styles.inputPos}>Reason:</label>
                  <textarea id="reasonn" type="text" className={styles.forTextArea}value={reason} onChange={(e) => setReason(e.target.value)} rows={5}cols={41} />
                </div>

                <button className={styles.button} onClick={handleSubmit}>
                  Book Appointment
                </button>
                {success && <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>}
                {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
                {appointmentDetails && (
                  <div style={{ marginTop: "1rem",  padding: "1rem", borderRadius: "5px" }}>
                    <h4>Appointment Details</h4>
                    <p><strong>Appointment ID:</strong> {appointmentDetails._id}</p>
                    <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                    <p><strong>Date:</strong> {appointmentDetails.date}</p>
                    <p><strong>Time:</strong> {appointmentDetails.time}</p>
                    <p><strong>Reason:</strong> {appointmentDetails.reason}</p>
                  </div>
                )}
              </div>
              <div className={styles.cancelButtonWrapper}>
            <button className={styles.cancelButton} onClick={() => setSelectedDoctor(null)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
          </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
