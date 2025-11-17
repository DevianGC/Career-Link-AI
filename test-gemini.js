// Test Gemini API Key
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyBKoR8OKJjq3wazDFg-cKsHYlIE-H8-2hM';
const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  try {
    console.log('Testing Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Say hello in JSON format: {"message": "your message"}');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Key is valid!');
    console.log('Response:', text);
  } catch (error) {
    console.error('❌ API Key test failed:');
    console.error('Error:', error.message);
    console.error('Details:', error);
  }
}

testAPI();
