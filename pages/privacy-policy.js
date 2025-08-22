// pages/privacy.js
import styles from '../styles/PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  // Automatically get today's date
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <div className={styles.lastUpdated}>Last Updated: {lastUpdated}</div>

        <h1>Privacy Policy</h1>

        <h2>Introduction</h2>
        <p>
          At DocEase, your privacy is extremely important to us. This Privacy Policy explains
          how we collect, use, share, and protect your personal information when you use our
          platform to book and manage doctor appointments. By using our services, you agree to
          the terms described here.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and login details.</li>
          <li><strong>Appointment Information:</strong> Selected doctor, appointment date/time, booking history, and any notes you choose to share.</li>
          <li><strong>Usage Data:</strong> IP address, device type, browser, and activity logs to improve user experience.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your data helps us to:</p>
        <ul>
          <li>Process and manage doctor appointments securely.</li>
          <li>Send confirmations, reminders, and relevant notifications.</li>
          <li>Provide personalized recommendations and improve platform features.</li>
          <li>Ensure security and prevent fraudulent activity.</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We use encryption, authentication, and monitoring practices to keep your data safe.
          While we take strong measures, no platform is completely immune to risks, so we encourage
          you to also protect your login details.
        </p>

        <h2>4. Sharing of Information</h2>
        <p>We do not sell or trade your data. Information is shared only with:</p>
        <ul>
          <li>Doctors or clinics you choose to book with.</li>
          <li>Regulatory authorities if required by law.</li>
          <li>Service providers (e.g., cloud hosting) strictly for operating DocEase.</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>As a user, you have the right to:</p>
        <ul>
          <li>Access and review your personal data.</li>
          <li>Request corrections or deletion of your information.</li>
          <li>Opt out of promotional communications.</li>
        </ul>

        <h2>6. Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The revised version will be posted
          on this page with an updated “Last Updated” date.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, you can contact us at:<br />
          📧 <a href="mailto:easeedoc@gmail.com">easeedoc@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;