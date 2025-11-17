# AI Matching System - Implementation Guide

## Overview
The GCCCS-CareerLink platform now includes AI-powered matching for both students and employers using Google's Gemini AI API.

## Features

### Student AI Matching
- **Smart Job Recommendations**: AI analyzes student profiles and job postings to provide personalized match scores (0-100%)
- **AI Explanations**: Each job recommendation includes AI-generated reasoning for why it's a good fit
- **Strengths & Improvements**: Shows what makes the student a strong candidate and areas to improve
- **Real-time Analysis**: Jobs are analyzed when the page loads using the student's profile

### Employer AI Matching
- **Candidate Evaluation**: AI analyzes candidate applications against job requirements
- **Detailed Scoring**: Four-dimension analysis (Skills, Experience, Education, Culture Fit)
- **AI Assessment**: Written evaluation of each candidate's suitability
- **Strengths & Concerns**: Highlights top strengths and potential concerns for each candidate

## Technical Implementation

### API Endpoints

#### `/api/ai-matching/student` (POST)
Matches students with jobs based on their profile.

**Request:**
```json
{
  "profile": {
    "skills": ["JavaScript", "React"],
    "education": "Computer Science",
    "experience": "2 years",
    "jobTypes": ["Full-time"],
    "locations": ["Remote"],
    "careerGoals": "..."
  },
  "jobs": [
    {
      "id": "job1",
      "title": "Frontend Developer",
      "company": "Tech Corp",
      "type": "Full-time",
      "location": "Remote",
      "description": "...",
      "requirements": ["React", "JavaScript"],
      "salary": "$60k-$80k"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      ...jobData,
      "matchScore": 85,
      "aiExplanation": "This position aligns well with your React skills...",
      "aiStrengths": ["Strong React experience", "Remote work preference matches"],
      "aiImprovements": ["Consider gaining backend experience"]
    }
  ]
}
```

#### `/api/ai-matching/employer` (POST)
Matches employer job postings with candidate applications.

**Request:**
```json
{
  "candidates": [
    {
      "id": "candidate1",
      "name": "John Doe",
      "education": "BS Computer Science",
      "experience": "3 years",
      "skills": ["Python", "Django"],
      "currentRole": "Backend Developer",
      "location": "New York",
      "salary": "$80k",
      "availability": "Immediate"
    }
  ],
  "jobDetails": {
    "title": "Senior Backend Developer",
    "department": "Engineering",
    "type": "Full-time",
    "location": "New York",
    "description": "...",
    "requirements": ["Python", "Django", "PostgreSQL"],
    "experienceLevel": "Senior"
  }
}
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      ...candidateData,
      "matchScore": 88,
      "aiInsights": {
        "skillMatch": 90,
        "experienceMatch": 85,
        "educationMatch": 88,
        "cultureFit": 87
      },
      "aiAssessment": "Strong technical background with relevant experience...",
      "aiStrengths": ["Expert Python skills", "3 years Django experience", "Local to NYC"],
      "aiConcerns": ["May need PostgreSQL training", "Salary expectations slightly high"]
    }
  ]
}
```

### Environment Variables
Ensure your `.env` file contains:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Security
- All API endpoints require Firebase authentication
- Tokens are validated using Firebase Admin SDK
- Unauthorized requests return 401 status

## Fallback Mechanism
If AI matching fails for any reason:
- **Students**: Falls back to basic algorithm matching (skill overlap, job type, location preferences)
- **Employers**: Falls back to simplified scoring (resume, experience, education, profile completeness)
- Users are not notified of fallback - they receive seamless service

## Usage

### For Students
1. Navigate to "AI Matching" in the student dashboard
2. Ensure your profile is complete (skills, education, preferences)
3. The system automatically analyzes all available jobs
4. View match scores, AI explanations, and personalized insights
5. Apply directly from the matching page

### For Employers
1. Navigate to "AI Matching" in the employer dashboard
2. Select a job position from the dropdown
3. The system analyzes all applicants for that position
4. Review AI-generated insights for each candidate
5. Use the filter slider to show candidates above a certain match threshold
6. Download resumes and view detailed profiles

## Performance Considerations
- AI analysis runs asynchronously to avoid blocking the UI
- Results are cached in component state
- Batch processing for multiple jobs/candidates
- Loading indicators show progress

## Error Handling
- API errors are caught and logged to console
- Fallback algorithms ensure functionality even if AI fails
- User-friendly error messages for authentication issues
- Graceful degradation maintains core functionality

## Future Enhancements
- Cache AI results in database to reduce API calls
- Add user feedback mechanism to improve AI accuracy
- Implement A/B testing for AI vs. non-AI matching
- Add explainability features (why this score?)
- Multi-language support for international students

## Troubleshooting

### Common Issues

**Issue**: "Unauthorized" error
- **Solution**: Ensure user is logged in and Firebase token is valid

**Issue**: AI matching not showing results
- **Solution**: Check console for errors, verify Gemini API key is set correctly

**Issue**: Match scores seem random
- **Solution**: Verify profile data is complete and properly formatted

**Issue**: Slow loading times
- **Solution**: Reduce batch size or implement pagination for large datasets

## Testing
1. Test with complete student profile
2. Test with incomplete student profile (fallback)
3. Test with multiple jobs (batch processing)
4. Test employer matching with multiple candidates
5. Test with invalid/missing data
6. Test authentication failures
7. Test API rate limits

## Monitoring
- Monitor Gemini API usage in Google Cloud Console
- Track API response times
- Log fallback usage frequency
- Monitor user engagement with AI features

## Credits
Built using Google Gemini 1.5 Flash model for fast, accurate AI matching.
