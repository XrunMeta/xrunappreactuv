export default {
  title: 'Enter Verification Code',
  description: 'Enter the 6-digit code sent to',
  resendCode: 'Resend Code',
  verifyButton: 'Verify',
  errors: {
    emailNotFound: 'Email information not found',
    codeRequired: 'Please enter the 6-digit verification code',
    verificationFailed: 'The verification code is invalid or this request has expired. Please request a new code and try again.',
    loginFailed: 'Login failed. Please try again',
    userDataNotFound: 'Unable to retrieve user information',
    error: 'An error occurred during verification',
    resendFailed: 'Failed to resend verification code. Please try again',
    resendError: 'An error occurred while resending the verification code',
  },
  success: {
    resendComplete: 'Verification code has been resent',
  },
  alerts: {
    error: 'Error',
    codeInput: 'Verification Code Input',
    verificationFailed: 'Verification Failed',
    loginFailed: 'Login Failed',
    resendComplete: 'Resend Complete',
    resendFailed: 'Resend Failed',
  },
  gmailGoogleLogin: {
    title: 'Google Login',
    message: 'Linking your Gmail account with Google Login allows you to sign in easily next time.',
    button: 'Google Login',
    emailMismatchTitle: 'Email Mismatch',
    emailMismatchMessage: 'The email you signed up with ({{email}}) does not match the Google account you just used.\n\nContinuing without linking.',
    emailMismatchButton: 'OK',
  },

  gmailGoogleLink: {
    askTitle: 'Link Google Account',
    askMessage: 'Would you like to link your Gmail signup with Google Login?\nYou can sign in more easily next time.',
    link: 'Link',
    skip: 'Later',
  },
};

