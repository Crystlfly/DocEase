import { useState } from "react";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

import styles from "@/styles/CompleteProfile.module.css";
import jwtDecode from 'jwt-decode';

export default function CompleteDoctorProfile() {
  const router = useRouter();
  // const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login'); // Not logged in, redirect
      return;
    }

    // try {
    //   const decoded = jwtDecode(token);
    //   if (decoded.role !== 'doctor') {
    //     router.replace('/unauthorized'); // Logged in but wrong role
    //   }else{
    //     setCheckingAuth(false);
    //   }
    // } catch (err) {
    //   router.replace('/login'); // Invalid token
    // }
  }, []);

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
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // 👈 You missed setting this earlier!
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
        body: submissionData,
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

  // if (checkingAuth) return <p>Checking authentication...</p>;

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
          {/* Custom Image Upload */}
          <div className={styles.avatarWrapper}>
            <label htmlFor="profile-upload" className={styles.avatarLabel}>
              {preview?(
                <img
                src={preview || "/default-avatar.png"}
                alt="Profile Preview"
                className={styles.avatarImage}
              />
              ):(<FontAwesomeIcon icon={faCircleUser} size="6x" className={styles.userIcon} />)}
              <div className={styles.overlay}>
                <span className={styles.overlayText}>Edit</span>
              </div>
            </label>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </div>

          <input
            className={styles.inputField}
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
          {/* Show error/success */}
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button type="submit" className={styles.button} disabled={uploading}>
            {uploading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}
