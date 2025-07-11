import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export default function ChooseRole() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function loadUser() {
      const session = await getSession();
      if (session && session.user?._id) {
        setUserId(session.user._id); // ✅ set it from session
        localStorage.setItem("UserId", session.user._id); // optional
      } else {
        console.warn("⚠️ User session or ID missing");
      }
    }
    loadUser();
  }, []);
  

  const handleSelectRole = async (role) => {
    const userid = localStorage.getItem("UserId");
      setSelectedRole(role);
    
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, role }),
      });

      const data = await res.json();
      if (data.success) {
            

        setSuccess("Signup successful! Redirecting you....");
        console.log("👉 Storing userRole as:", role);

        localStorage.setItem("userRole", role);
        setTimeout(async () => {
          setIsExiting(true); // trigger animation
          setTimeout(async () => {
            
            router.push(role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
          }, 800);
        }, 2000);
      }
      else if(res.status === 400){
        if(role==="doctor"){
          router.push("/doctor/dashboard");
        }
        else if(role === "patient"){
          router.push("/patient/dashboard");
        }
      }
      else{
        console.error("Error setting role:", data.message);
        // alert("Failed to set role. Please try again.");
        setError("Something went wrong.");
      }
     

     // wait for animation to finish (match with CSS duration)
  };

  return (
    <div className={`container ${isExiting ? (selectedRole === "doctor" ? "fade-out-doctor" : "fade-out-patient") : ""}`}>
      <h1>Welcome! 👋</h1>
      <p>How would you like to use our platform?</p>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
{success && <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>}

      <div className="role-options">
        <div className="card" onClick={() => handleSelectRole("doctor")}>
          <h2>👨‍⚕️ I'm a Doctor</h2>
          <p>Manage appointments, build trust, and grow your practice.</p>
        </div>
        <div className="card" onClick={() => handleSelectRole("patient")}>
          <h2>🧑‍🦱 I'm a Patient</h2>
          <p>Find trusted doctors and book appointments easily.</p>
        </div>
      </div>

      <style jsx>{`
        .container {
          text-align: center;
          padding: 3rem;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .fade-out-doctor {
          opacity: 0;
          transform: translateX(30px); /* Doctor → right */
        }

        .fade-out-patient {
          opacity: 0;
          transform: translateX(-30px); /* Patient → left */
        }

        .role-options {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .card {
          width: 250px;
          padding: 1.5rem;
          border: 2px solid #ccc;
          border-radius: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: scale(1.05);
          border-color: teal;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h1 {
          color: #333;
        }
      `}</style>
    </div>
  );
}
