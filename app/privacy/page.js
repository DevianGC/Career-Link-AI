'use client';
import Link from 'next/link';
import styles from './privacy.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: November 17, 2025</p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            GCCCS CareerLink ("we," "our," or "us") is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you use
            our career services platform.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information (email, phone number)</li>
            <li>Academic information (major, graduation year, GPA)</li>
            <li>Professional information (resume, work experience, skills)</li>
            <li>Account credentials (email and password)</li>
            <li>Profile photos and other uploaded documents</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, features used)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and manage your account</li>
            <li>Connect students with employers and mentors</li>
            <li>Process job applications and communications</li>
            <li>Send you notifications about your account and platform updates</li>
            <li>Analyze platform usage and improve user experience</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Information Sharing and Disclosure</h2>
          
          <h3>With Other Users</h3>
          <p>
            Depending on your role, certain information may be visible to other users:
          </p>
          <ul>
            <li><strong>Students:</strong> Profile information visible to employers and mentors</li>
            <li><strong>Employers:</strong> Company information visible to students</li>
            <li><strong>Alumni:</strong> Professional information visible to students and other alumni</li>
          </ul>

          <h3>With Service Providers</h3>
          <p>
            We may share information with third-party service providers who perform services on our behalf,
            such as:
          </p>
          <ul>
            <li>Cloud hosting and storage (Firebase, Vercel)</li>
            <li>Email delivery services</li>
            <li>Analytics providers</li>
          </ul>

          <h3>For Legal Reasons</h3>
          <p>We may disclose information when required by law or to:</p>
          <ul>
            <li>Comply with legal processes</li>
            <li>Protect our rights and property</li>
            <li>Prevent fraud or security issues</li>
            <li>Protect the safety of our users</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information, including:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Secure authentication with Firebase Authentication</li>
            <li>Regular security assessments</li>
            <li>Access controls and monitoring</li>
          </ul>
          <p>
            However, no method of transmission over the internet is 100% secure. While we strive to
            protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Update:</strong> Correct or update your information through your profile settings</li>
            <li><strong>Delete:</strong> Request deletion of your account and personal data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from promotional emails</li>
            <li><strong>Data Portability:</strong> Request your data in a portable format</li>
          </ul>
          <p>
            To exercise these rights, please contact us at careerlink@gcccs.edu
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to:
          </p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Authenticate your account</li>
            <li>Analyze platform usage</li>
            <li>Improve platform performance</li>
          </ul>
          <p>
            You can control cookies through your browser settings, but disabling cookies may affect
            platform functionality.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to:
          </p>
          <ul>
            <li>Provide our services to you</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p>
            When you delete your account, we will delete or anonymize your personal information,
            except where we are required by law to retain it.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Children's Privacy</h2>
          <p>
            Our platform is intended for users who are at least 18 years old or enrolled in higher
            education. We do not knowingly collect information from children under 13.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites or services. We are not responsible
            for the privacy practices of these external sites. We encourage you to review their privacy
            policies.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by:
          </p>
          <ul>
            <li>Posting the updated policy on this page</li>
            <li>Updating the "Last Updated" date</li>
            <li>Sending an email notification for material changes</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>12. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data practices,
            please contact us:
          </p>
          <p>
            <strong>Email:</strong> careerlink@gcccs.edu<br />
            <strong>Address:</strong> Gordon College Career Services<br />
            419 College Drive, Barnesville, GA 30204<br />
            <strong>Phone:</strong> (770) 358-5000
          </p>
        </section>

        <section className={styles.section}>
          <h2>13. Your California Privacy Rights</h2>
          <p>
            If you are a California resident, you have additional rights under the California Consumer
            Privacy Act (CCPA), including the right to know what personal information we collect and
            how we use it, and the right to request deletion of your information.
          </p>
        </section>

        <div className={styles.footer}>
          <p>
            By using GCCCS CareerLink, you acknowledge that you have read and understood this Privacy
            Policy and consent to the collection and use of your information as described.
          </p>
          <p>
            <Link href="/terms" className={styles.link}>View Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
