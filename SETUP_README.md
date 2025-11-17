# Career-Link-AI Setup Guide

This guide will help you set up and run the Career-Link-AI system on your local machine.

---

## 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher recommended)
- **Firebase Project** (for authentication, Firestore, and storage)

---

## 2. Clone the Repository
```sh
git clone https://github.com/DevianGC/Career-Link-AI.git
cd Career-Link-AI
```

---

## 3. Install Dependencies
```sh
npm install
```

---

## 4. Environment Variables
Create a `.env.local` file in the root directory and add your Firebase credentials:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

GOOGLE_API_KEY=your-google-api-key # For AI matching
```

- Get these values from your Firebase project settings and service account.
- For AI matching, enable the Generative AI API in Google Cloud and provide the API key.
- Escape newlines in `FIREBASE_PRIVATE_KEY` as `\n`.

---

## 5. Firestore Setup
- In the Firebase console, create Firestore in **Native mode**.
- Create collections: `jobs`, `applications`, `users`, `profiles`.
- Import or seed initial data as needed.
- Add indexes as required (see `firestore.indexes.json`).

---

## 6. Running the App
```sh
npm run dev
```
- The app will be available at `http://localhost:3000`

---

## 7. AI Matching
- The system uses Google Generative AI for advanced matching.
- Make sure `@google/generative-ai` is installed (already in dependencies).
- Provide a valid `GOOGLE_API_KEY` in your `.env.local`.

---

## 8. Useful Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server

---

## 9. Additional Notes
- See `FIREBASE_IMPROVEMENTS.md` and `ROUTING_FIXES.md` for architecture and routing details.
- For AI matching details, see `AI_MATCHING_README.md`.
- For troubleshooting, check the console for errors and ensure all environment variables are set.

---

## 10. Deployment
- Configure environment variables in your deployment platform (Vercel, Netlify, etc.)
- Ensure Firebase and Google API keys are set in the deployment environment.

---

## License
MIT
