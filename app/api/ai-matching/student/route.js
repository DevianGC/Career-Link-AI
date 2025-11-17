import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { adminAuth } from '@/lib/firebaseAdmin';

// Validate API key on initialization
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not configured');
}

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(request) {
  try {
    // Check if Gemini AI is available
    if (!genAI) {
      console.error('Gemini AI not initialized - API key missing');
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const body = await request.json();
    const { jobs, profile } = body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json({ error: 'Jobs array is required' }, { status: 400 });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile is required' }, { status: 400 });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create matching results array
    const matchedJobs = [];

    console.log('Starting AI analysis for', jobs.length, 'jobs');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);

    for (const job of jobs) {
      try {
        console.log(`Analyzing job: ${job.title}`);
        const prompt = `You are an expert career counselor and job matching AI. Analyze the following student profile and job posting to determine compatibility.

Student Profile:
- Skills: ${Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || 'Not specified'}
- Education: ${profile.education || 'Not specified'}
- Experience: ${profile.experience || 'Not specified'}
- Preferred Job Types: ${Array.isArray(profile.jobTypes) ? profile.jobTypes.join(', ') : profile.jobTypes || 'Not specified'}
- Preferred Locations: ${Array.isArray(profile.locations) ? profile.locations.join(', ') : profile.locations || 'Not specified'}
- Career Goals: ${profile.careerGoals || 'Not specified'}

Job Posting:
- Title: ${job.title}
- Company: ${job.company}
- Type: ${job.type}
- Location: ${job.location}
- Description: ${job.description}
- Requirements: ${Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements || 'Not specified'}
- Salary: ${job.salary || 'Not specified'}

Based on this information, provide:
1. A match score from 0-100 (higher is better)
2. A brief explanation (2-3 sentences) of why this is a good or poor match
3. Key strengths that make the candidate suitable
4. Areas for improvement or missing qualifications

Return ONLY a valid JSON object in this exact format:
{
  "matchScore": <number 0-100>,
  "explanation": "<string>",
  "strengths": ["<string>", "<string>"],
  "improvements": ["<string>", "<string>"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`Raw AI response for ${job.title}:`, text.substring(0, 200));
        
        // Extract JSON from response
        let aiAnalysis;
        try {
          // Try to parse the entire response as JSON
          aiAnalysis = JSON.parse(text);
        } catch (e) {
          // If that fails, try to extract JSON from markdown code blocks
          const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (jsonMatch) {
            aiAnalysis = JSON.parse(jsonMatch[1]);
          } else {
            // Try to find any JSON object in the text
            const objectMatch = text.match(/\{[\s\S]*\}/);
            if (objectMatch) {
              aiAnalysis = JSON.parse(objectMatch[0]);
            } else {
              throw new Error('No valid JSON found in response');
            }
          }
        }

        matchedJobs.push({
          ...job,
          matchScore: aiAnalysis.matchScore || 0,
          aiExplanation: aiAnalysis.explanation || '',
          aiStrengths: aiAnalysis.strengths || [],
          aiImprovements: aiAnalysis.improvements || []
        });

      } catch (error) {
        console.error(`Error analyzing job ${job.id}:`, error);
        console.error('Error details:', error.message, error.stack);
        // Fallback to basic scoring if AI fails
        matchedJobs.push({
          ...job,
          matchScore: calculateFallbackScore(profile, job),
          aiExplanation: 'AI analysis unavailable, using basic matching algorithm',
          aiStrengths: [],
          aiImprovements: []
        });
      }
    }

    // Sort by match score descending
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ 
      success: true,
      matches: matchedJobs 
    });

  } catch (error) {
    console.error('AI Matching Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process AI matching',
      details: error.message 
    }, { status: 500 });
  }
}

// Fallback scoring function if AI fails
function calculateFallbackScore(profile, job) {
  let score = 50; // Base score

  const skills = toArray(profile?.skills).map(s => s.toLowerCase());
  const jobReqs = toArray(job?.requirements).map(r => r.toLowerCase());
  const prefsTypes = toArray(profile?.jobTypes).map(s => s.toLowerCase());
  const prefsLocations = toArray(profile?.locations).map(s => s.toLowerCase());
  const jobType = (job?.type || '').toLowerCase();
  const jobLocation = (job?.location || '').toLowerCase();

  // Skill matching
  if (skills.length && jobReqs.length) {
    const overlap = jobReqs.filter(r => skills.some(s => r.includes(s) || s.includes(r)));
    score += (overlap.length / jobReqs.length) * 30;
  }

  // Job type preference
  if (prefsTypes.length && prefsTypes.includes(jobType)) {
    score += 10;
  }

  // Location preference
  if (prefsLocations.length && prefsLocations.some(loc => jobLocation.includes(loc))) {
    score += 10;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}
