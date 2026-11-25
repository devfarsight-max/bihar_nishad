export function safeDestination(path) {
  return typeof path === 'string' && /^\/(?!\/)/.test(path) && !/[\\\r\n]/.test(path) && !/^\/(login|register|reset-password|auth)(\/|\?|$)/.test(path) ? path : '/dashboard';
}

export function validateAuth(values, mode) {
  if (mode !== 'reset' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) return 'Enter a valid email address.';
  if (mode === 'register' && !values.name.trim()) return 'Enter your name.';
  if (['register', 'reset'].includes(mode)) {
    if (values.password.length < 8) return 'Use a password with at least 8 characters.';
    if (values.password !== values.confirm) return 'The passwords do not match.';
  }
  return '';
}

export function authError(error) {
  const messages = {
    invalid_credentials: 'The email or password is incorrect.',
    email_not_confirmed: 'Please verify your email before signing in.',
    over_email_send_rate_limit: 'Too many email requests. Please wait before trying again.',
    over_request_rate_limit: 'Too many attempts. Please wait and try again.',
    weak_password: 'Choose a stronger password that meets the project’s password requirements.',
    same_password: 'Choose a password different from your current password.',
    otp_expired: 'This link has expired. Please request a new email.',
    signup_disabled: 'Registration is currently unavailable.',
    user_already_exists: 'Unable to register. Try signing in or resetting your password.',
    admin_access_denied: 'Your account does not have administrator access.',
    admin_check_failed: 'Unable to verify administrator access. Please try again.',
  };
  if (error?.name === 'AuthRetryableFetchError' || error instanceof TypeError) return 'Unable to reach authentication. Check your connection and try again.';
  return messages[error?.code] || error?.message || 'We could not complete your request. Please try again.';
}
