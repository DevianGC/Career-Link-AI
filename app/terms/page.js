'use client';
import Link from 'next/link';
import styles from './terms.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last Updated: November 17, 2025</p>

        <section className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the GCCCS CareerLink platform, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service. If you do not agree to these
            terms, please do not use our platform.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. User Accounts</h2>
          <p>
            To access certain features of the platform, you must register for an account. You are
            responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information during registration</li>
            <li>Updating your information to keep it accurate and current</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. User Roles and Responsibilities</h2>
          
          <h3>Students</h3>
          <ul>
            <li>Must be currently enrolled or recently graduated from GCCCS</li>
            <li>Provide accurate academic and professional information</li>
            <li>Maintain professional conduct when applying for positions</li>
          </ul>

          <h3>Employers</h3>
          <ul>
            <li>Must represent legitimate companies or organizations</li>
            <li>Post only genuine job opportunities</li>
            <li>Respect student privacy and use their information only for recruitment purposes</li>
            <li>Comply with all applicable employment laws and regulations</li>
          </ul>

          <h3>Alumni</h3>
          <ul>
            <li>Must be verified graduates of GCCCS</li>
            <li>Provide mentorship in good faith</li>
            <li>Maintain professional boundaries with students</li>
          </ul>

          <h3>Faculty Mentors</h3>
          <ul>
            <li>Must be verified GCCCS faculty members</li>
            <li>Provide guidance and support to students</li>
            <li>Maintain academic integrity and professional standards</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the platform for any unlawful purpose</li>
            <li>Post false, misleading, or fraudulent information</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
            <li>Distribute spam, malware, or other harmful content</li>
            <li>Scrape or collect user data without permission</li>
            <li>Impersonate another person or entity</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. Content and Intellectual Property</h2>
          <p>
            Users retain ownership of content they submit to the platform. By posting content, you grant
            GCCCS CareerLink a non-exclusive, worldwide, royalty-free license to use, display, and
            distribute your content on the platform.
          </p>
          <p>
            The platform's design, code, logos, and other materials are protected by copyright and other
            intellectual property laws.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Job Postings and Applications</h2>
          <p>
            GCCCS CareerLink serves as a platform connecting employers and job seekers. We do not:
          </p>
          <ul>
            <li>Verify the accuracy of job postings</li>
            <li>Guarantee employment outcomes</li>
            <li>Endorse any particular employer or opportunity</li>
            <li>Participate in employment decisions or negotiations</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Privacy and Data Protection</h2>
          <p>
            Your use of the platform is also governed by our{' '}
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
            We are committed to protecting your personal information and using it only as described
            in our Privacy Policy.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time for:
          </p>
          <ul>
            <li>Violation of these Terms of Service</li>
            <li>Fraudulent or illegal activity</li>
            <li>Extended periods of inactivity</li>
            <li>At your request</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. Disclaimers</h2>
          <p>
            The platform is provided "as is" without warranties of any kind. We do not guarantee:
          </p>
          <ul>
            <li>Uninterrupted or error-free service</li>
            <li>The accuracy or reliability of content posted by users</li>
            <li>Specific outcomes from using the platform</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>10. Limitation of Liability</h2>
          <p>
            GCCCS CareerLink shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages resulting from your use of or inability to use the platform.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Continued use of the platform
            after changes constitutes acceptance of the updated terms. We will notify users of
            significant changes via email or platform notification.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> careerlink@gcccs.edu<br />
            <strong>Address:</strong> Gordon College Career Services<br />
            419 College Drive, Barnesville, GA 30204
          </p>
        </section>

        <div className={styles.footer}>
          <p>
            By using GCCCS CareerLink, you acknowledge that you have read and understood these Terms
            of Service and agree to be bound by them.
          </p>
        </div>
      </div>
    </div>
  );
}
