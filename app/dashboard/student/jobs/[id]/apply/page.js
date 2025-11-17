'use client';

import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import Card from '@/components/UI/Card/Card';
import Button from '@/components/UI/Button/Button';

export default function ApplyPage() {
  const router = useRouter();
  const { id } = router.query || {}; // Ensure router.query is defined before destructuring

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Please select a PDF resume to upload.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    if (file.size > 7 * 1024 * 1024) {
      setError('File size exceeds 7MB limit.');
      return;
    }
    setSubmitting(true);
    // TODO: Implement actual upload logic here
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <DashboardLayout userType="student">
        <Card>
          <h1>Application Submitted!</h1>
          <p>Thank you for applying. We will review your application and contact you soon.</p>
          <Button variant="secondary" onClick={() => router.push('/dashboard/student/jobs')}>Back to Job Listings</Button>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <Card>
        <h1>Apply for Job <span style={{fontWeight:700}}>{id || '...'}</span></h1>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.5rem',marginTop:'2rem'}}>
          <div style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{display:'none'}}
            />
            <label htmlFor="resume-upload">
              <Button
                type="button"
                style={{background:'#2563eb',color:'#fff',fontWeight:600,fontSize:'1.1rem',marginBottom:'0.5rem'}}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                Choose File
              </Button>
              <span style={{marginLeft:'1rem',fontSize:'1rem',color:'#222'}}>
                {file ? file.name : 'No file chosen'}
              </span>
            </label>
            <div style={{fontSize:'0.95rem',color:'#666',marginTop:'0.5rem'}}>Please upload a PDF version of your resume. Maximum file size: 7 MB.</div>
            {error && <div style={{color:'red',marginTop:'0.5rem'}}>{error}</div>}
          </div>
          <Button
            variant="primary"
            type="submit"
            style={{width:'100%',background:'#2563eb',fontWeight:600,fontSize:'1.1rem',padding:'1rem 0'}}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}
