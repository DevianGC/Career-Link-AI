'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../../components/Dashboard/DashboardLayout';
import Card, { CardBody, CardHeader, CardFooter } from '../../../../components/UI/Card/Card';
import Button from '../../../../components/UI/Button/Button';
import { firebaseAuth } from '@/lib/firebaseClient';
import styles from './matching.module.css';

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      // handle stringified arrays if any
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

export default function StudentMatchingPage() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.allSettled([
      fetch('/api/profile', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/jobs', { cache: 'no-store' }).then(r => r.json()),
    ])
      .then(([pRes, jRes]) => {
        if (!mounted) return;
        const p = pRes.status === 'fulfilled' ? pRes.value : null;
        const j = jRes.status === 'fulfilled' ? jRes.value : {};

        if (p && p.error) {
          setProfile(null);
        } else if (p && p.profile) {
          setProfile(p.profile);
        }

        // Handle both array format and object format from API
        const jobsData = Array.isArray(j) ? j : (j.jobs ? j.jobs : []);
        console.log('Jobs loaded:', jobsData.length, jobsData);
        setJobs(jobsData);
        
        // If we have both profile and jobs, trigger AI matching
        if (p?.profile && jobsData.length > 0) {
          performAIMatching(p.profile, jobsData);
        } else {
          setMatchedJobs(jobsData);
        }
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load recommendations');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const performAIMatching = async (userProfile, jobsList) => {
    setAiLoading(true);
    try {
      const user = firebaseAuth?.currentUser;
      if (!user) {
        // No auth, use basic matching
        console.warn('No authenticated user, skipping AI matching');
        setMatchedJobs(jobsList);
        return;
      }

      const token = await user.getIdToken();
      
      console.log('Calling AI matching API with', jobsList.length, 'jobs');
      
      const response = await fetch('/api/ai-matching/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: userProfile,
          jobs: jobsList
        })
      });

      console.log('AI API response status:', response.status);
      const data = await response.json();
      console.log('AI API response data:', data);
      
      if (data.success && data.matches) {
        console.log('✅ AI matching successful!', data.matches.length, 'matches');
        console.log('First job AI data:', data.matches[0]); // Debug first job
        setMatchedJobs(data.matches);
      } else {
        // Fallback to original jobs if AI fails
        console.warn('⚠️ AI matching failed, using fallback:', data.error || 'Unknown error');
        setMatchedJobs(jobsList);
      }
    } catch (error) {
      console.error('❌ AI Matching error:', error);
      // Fallback to original jobs
      setMatchedJobs(jobsList);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <DashboardLayout userType="student">
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>AI-Powered Job Matching</h1>
        <p className={styles.subtitle}>
          {profile ? 'Personalized AI recommendations based on your profile.' : 'Sign in and complete your profile for AI-powered recommendations.'}
        </p>
        {aiLoading && (
          <div className={styles.aiIndicator}>
            <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>AI is analyzing matches...</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingBox}>Loading recommendations…</div>
      ) : error ? (
        <div className={styles.errorBox}>{error}</div>
      ) : matchedJobs.length === 0 ? (
        <div className={styles.emptyState}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
            <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h3 style={{ marginBottom: '8px' }}>No Job Postings Available</h3>
          <p style={{ color: '#666', marginBottom: '16px' }}>There are currently no active job postings in the system.</p>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            Employers need to post jobs first. Check back later or contact your career office.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {matchedJobs.map((job) => (
            <Card key={job.id} className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <div className={styles.companyRow}>
                    <span className={styles.company}>{job.company}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.location}>{job.location}</span>
                  </div>
                </div>
                <div className={styles.scoreBadge} title="AI Match Score">
                  {job.matchScore}%
                </div>
              </CardHeader>
              <CardBody>
                {job.aiExplanation && (
                  <div className={styles.aiExplanation}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                    <p>{job.aiExplanation}</p>
                  </div>
                )}
                <p className={styles.description}>
                  {job.description?.length > 180 ? job.description.slice(0, 180) + '…' : job.description}
                </p>
                {job.aiStrengths && job.aiStrengths.length > 0 && (
                  <div className={styles.aiStrengths}>
                    <div className={styles.strengthsLabel}>✓ Your Strengths</div>
                    <ul className={styles.strengthsList}>
                      {job.aiStrengths.slice(0, 2).map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {job.aiImprovements && job.aiImprovements.length > 0 && (
                  <div className={styles.aiImprovements}>
                    <div className={styles.improvementsLabel}>⚠ Areas to Improve</div>
                    <ul className={styles.improvementsList}>
                      {job.aiImprovements.slice(0, 2).map((improvement, i) => (
                        <li key={i}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardBody>
              <CardFooter className={styles.footer}>
                <div className={styles.meta}>
                  <span className={styles.typeTag}>{job.type}</span>
                  {job.salary && <span className={styles.salary}>{job.salary}</span>}
                </div>
                <div className={styles.actions}>
                  <Button variant="text" href={`/dashboard/student/jobs/${job.id}`}>View Details</Button>
                  <Button variant="primary" href={`/dashboard/student/jobs/${job.id}/apply`}>
                    Apply Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
