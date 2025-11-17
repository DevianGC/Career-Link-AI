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
    const { candidates, jobDetails } = body;

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: 'Candidates array is required' }, { status: 400 });
    }

    if (!jobDetails) {
      return NextResponse.json({ error: 'Job details are required' }, { status: 400 });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create matching results array
    const matchedCandidates = [];

    for (const candidate of candidates) {
      try {
        const prompt = `You are an expert HR recruiter and candidate evaluation AI. Analyze the following candidate profile against the job requirements to determine fit.

Job Requirements:
- Title: ${jobDetails.title}
- Department: ${jobDetails.department || jobDetails.company || 'Not specified'}
- Type: ${jobDetails.type || 'Not specified'}
- Location: ${jobDetails.location || 'Not specified'}
- Description: ${jobDetails.description || 'Not specified'}
- Requirements: ${Array.isArray(jobDetails.requirements) ? jobDetails.requirements.join(', ') : jobDetails.requirements || 'Not specified'}
- Experience Level: ${jobDetails.experienceLevel || 'Not specified'}

Candidate Profile:
- Name: ${candidate.name}
- Education: ${candidate.education || 'Not specified'}
- Experience: ${candidate.experience || 'Not specified'}
- Skills: ${Array.isArray(candidate.skills) ? candidate.skills.join(', ') : candidate.skills || 'Not specified'}
- Current Role: ${candidate.currentRole || 'Not specified'}
- Location: ${candidate.location || 'Not specified'}
- Expected Salary: ${candidate.salary || 'Not specified'}
- Availability: ${candidate.availability || 'Not specified'}

Based on this information, provide:
1. An overall match score from 0-100 (higher is better)
2. Individual scores for:
   - Skill Match (0-100): How well do their skills align with job requirements?
   - Experience Match (0-100): Is their experience level appropriate?
   - Education Match (0-100): Does their education meet requirements?
   - Culture Fit (0-100): Based on available info, would they fit the role?
3. A brief overall assessment (2-3 sentences)
4. Top 3 key strengths that make them suitable
5. Top 3 areas of concern or gaps

Return ONLY a valid JSON object in this exact format:
{
  "matchScore": <number 0-100>,
  "skillMatch": <number 0-100>,
  "experienceMatch": <number 0-100>,
  "educationMatch": <number 0-100>,
  "cultureFit": <number 0-100>,
  "assessment": "<string>",
  "strengths": ["<string>", "<string>", "<string>"],
  "concerns": ["<string>", "<string>", "<string>"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response
        let aiAnalysis;
        try {
          aiAnalysis = JSON.parse(text);
        } catch (e) {
          const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (jsonMatch) {
            aiAnalysis = JSON.parse(jsonMatch[1]);
          } else {
            const objectMatch = text.match(/\{[\s\S]*\}/);
            if (objectMatch) {
              aiAnalysis = JSON.parse(objectMatch[0]);
            } else {
              throw new Error('No valid JSON found in response');
            }
          }
        }

        matchedCandidates.push({
          ...candidate,
          matchScore: aiAnalysis.matchScore || 0,
          aiInsights: {
            skillMatch: aiAnalysis.skillMatch || 0,
            experienceMatch: aiAnalysis.experienceMatch || 0,
            educationMatch: aiAnalysis.educationMatch || 0,
            cultureFit: aiAnalysis.cultureFit || 0
          },
          aiAssessment: aiAnalysis.assessment || '',
          aiStrengths: aiAnalysis.strengths || [],
          aiConcerns: aiAnalysis.concerns || []
        });

      } catch (error) {
        console.error(`Error analyzing candidate ${candidate.id}:`, error);
        // Fallback to basic scoring if AI fails
        const fallbackScore = calculateFallbackScore(candidate, jobDetails);
        matchedCandidates.push({
          ...candidate,
          matchScore: fallbackScore,
          aiInsights: {
            skillMatch: fallbackScore - 5,
            experienceMatch: fallbackScore,
            educationMatch: fallbackScore - 3,
            cultureFit: fallbackScore - 7
          },
          aiAssessment: 'AI analysis unavailable, using basic matching algorithm',
          aiStrengths: candidate.keyStrengths || [],
          aiConcerns: []
        });
      }
    }

    // Sort by match score descending
    matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ 
      success: true,
      matches: matchedCandidates 
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
function calculateFallbackScore(candidate, jobDetails) {
  let score = 50; // Base score

  // Resume/CV presence
  if (candidate.resume || candidate.resumeData) {
    score += 10;
  }

  // Experience relevance
  if (candidate.experience) {
    score += 10;
  }

  // Education
  if (candidate.education) {
    score += 10;
  }

  // Skills match
  if (candidate.skills && Array.isArray(candidate.skills) && candidate.skills.length > 0) {
    score += 10;
  }

  // Email verification
  if (candidate.emailVerified) {
    score += 5;
  }

  // Add some randomness for variation
  score += Math.floor(Math.random() * 10);

  return Math.min(100, Math.max(0, Math.round(score)));
}
