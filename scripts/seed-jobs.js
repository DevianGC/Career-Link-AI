// Script to seed sample jobs into Firestore
// Run with: node scripts/seed-jobs.js

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'gc-devs-391a3',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@gc-devs-391a3.iam.gserviceaccount.com',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQChfnkVPwaNyYzV\nJuUeW9Gh7zMVLNejp6gNJdmAU2cVxWv/ucYX8ea/aUDLRlz4x2h2LyaQ62xObvJC\nSYGBm7GK/DrW2rBGxxDsQ4WF6OE2FuUqgFYVJgUJ4wT5MjgTJSV76bt7A5KIbPLL\nZkgRce8rTG1vVTc/SKdfqEJ9S4g3UdpxVwi8rDzTQteh5Gv5eUL6ebzQ5wSQcWb7\noJJ4wjdYsbJSFMRIhJ8zkd1T3ofjATp/7W5FS1sTCyeKZdqoyINCJ7BnXTs40yHx\nYb2wfxOyNOwU4Mga88a82N3TxUnURySGSkbc7b4r8u0KS97pbHQfWpNx9Za3XT5O\niml+hmc5AgMBAAECggEARHuc/jkBXvwi6Dr7u0GFps2IVIj1EvXkalrsHqJ/mvhi\nwYl2qy3OQ8pvCySWBXuOXVvGV3s2LRaYTircq+kpw34Nt5H6YbFGCGLjyvMEGgtg\neAL/Pi2mwlgOglxc8iV0/VSTR+muaIMG/OEtW5R8r1hUKfuxl3kIXSS9uWNf6tDz\nIeg6yeGMz504no85yJKMjcCaPkiQ82TPQ/7+JuXMLDZ4Ne4fRx1nntQDIdKypOIw\nsOJiLM/0ElFgksp366JiJ/J28ufGYjCy4q3DES59p0S1oMVRWSuOhAkCuq0FEaPi\nE3YEAfU8GiJHBSse/+Cw9o2jQzzoCYlb7YnuJlReTwKBgQDTtScdog82e+x6Xiva\nW5kJbqy220ClIm8bOx3gIB5f9RoPTX0+lF0YvTsU4KxfbRwZKIVrFg6+zWTxoxWn\nq3XeuGF7ydfl/UZOYwPVY/zyl4sdSDGEnNbi7EPcky3QH1VTjMEp28BUmKVXNjyd\nrhfj9eBsPpHpFI0gUL1KUbqVuwKBgQDDR+5Fa9PeM2TcaYWGZ1PEdz58P9vtDTCL\njWJ1t636WKzqezWSBsZZ+43DDIpeAFcNWhYNkr8yl1nGY2HEoE/gagafRXK2xLQG\nZ4oJhmuQEnUJT5RvJ67FGS1fp3VRLfg8FRKHrZOfQZ8kW4yr+C1Wb6wNoYK8mukV\nyiBXRAXNmwKBgEw4XUPa89Uu2p3Xx7wO3FM8CGyxFV4evpe0OfZWOflcOiymPmBI\ndBgTEPFcTlLw6nvYTeiXAWoKcrxYddRu87ni8h3qNpO0ExrnpRqvrAL/MnOxaTqQ\naQE8BNamGoliroqtE2Jpnp4WcviqKzqt0iYdgNYX1NpwrrqitvPJ5v4/AoGAanfG\nNb0zNxtIK0+wx/V/20a0H6PlcRnW1M8R1mJ9jVdZd0ITk/jznc2jnasxqUyAKbxq\n952BdsDD5oD6pexNgGnuEFoZ0AHwsOk0fjr2XAdkHd5wbCXziGxQq60uLkNk6sUG\nZEjDinmJnZX4XS4i8dRStt/O2quO1x1rgoiIrW8CgYEAx1gw6huTSDqE2t0WHORK\niKcwQO/uExGisZSM5g5xqzGhYFW9VRBI8fAIwyExtcGpUPSDd7wC/tJfbeWm2yHb\nIsjuEvumrNA9JY/WSTVg+EAbW3i7LdL7b5ddbRjCZkiGltMX4eUyYqzdlCvWcyJz\nh/dhC9rjIqPiq1+NUebxwVY=\n-----END PRIVATE KEY-----\n').replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function seedJobs() {
  try {
    // Read jobs from data file
    const jobsPath = join(__dirname, '..', 'data', 'jobs.json');
    const jobsData = JSON.parse(readFileSync(jobsPath, 'utf-8'));

    console.log(`Found ${jobsData.length} jobs to seed...`);

    // Create a batch
    const batch = db.batch();
    let count = 0;

    for (const job of jobsData) {
      const jobRef = db.collection('jobs').doc();
      
      // Prepare job document
      const jobDoc = {
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary || '',
        description: job.description,
        requirements: job.requirements || [],
        status: job.status || 'Active',
        featured: job.featured || false,
        posted: job.posted || new Date().toISOString(),
        deadline: job.deadline || '',
        employerId: 'system', // You can change this to a real employer ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      batch.set(jobRef, jobDoc);
      count++;

      // Firestore batch limit is 500
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`Committed ${count} jobs...`);
      }
    }

    // Commit remaining jobs
    if (count % 500 !== 0) {
      await batch.commit();
    }

    console.log(`✅ Successfully seeded ${count} jobs to Firestore!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

seedJobs();
