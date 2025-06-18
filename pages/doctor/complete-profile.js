import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/CompleteProfile.module.css";

export default function CompleteDoctorProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    specialization: "",
    experience: "",
    address: "",
    about: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);

    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    if (imageFile) {
      submissionData.append("image", imageFile);
    }

    try {
      const res = await fetch("/api/doc/complete-profile", {
        method: "POST",
        body: submissionData, // no need to set Content-Type, browser handles it
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Profile update failed");
      } else {
        setSuccess("Profile completed successfully!");
        localStorage.setItem("profileCompleted", "true");
        setTimeout(() => router.push("/doctor/dashboard"), 2000);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
          <div className={styles.cancelButtonWrapper}>
            <Link href="/doctor/dashboard" className={styles.cancelButton}>
              <FontAwesomeIcon icon={faXmark} />
            </Link>
          </div>

          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={uploading}
          />
          <input
            type="text"
            className={styles.inputField}
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            disabled={uploading}
          />
          <input
            type="text"
            className={styles.inputField}
            name="experience"
            placeholder="Experience (e.g., 5 years)"
            value={formData.experience}
            onChange={handleChange}
            required
            disabled={uploading}
          />
          <input
            type="text"
            className={styles.inputField}
            name="address"
            placeholder="Clinic Address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={uploading}
          />
          <textarea
            name="about"
            className={styles.textareaField}
            placeholder="About You"
            value={formData.about}
            onChange={handleChange}
            rows={4}
            required
            disabled={uploading}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.inputField}
            disabled={uploading}
          />

          <button type="submit" className={styles.button}disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
           
          </button>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </form>
      </div>
    </main>
  );
}
