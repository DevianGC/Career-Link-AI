import { NextResponse } from 'next/server';
import { adminAuth } from '../../../../lib/firebaseAdmin';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await adminAuth.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate email verification link
    const link = await adminAuth.generateEmailVerificationLink(email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verification email sent successfully',
        link // This is for development/testing - remove in production
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email. Please try again.' },
      { status: 500 }
    );
  }
}
