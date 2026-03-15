import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../home/Navbar';
import apiUrl from '../../api';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${apiUrl}users/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || 'Something went wrong', type: 'error' });
        return;
      }

      setMessage({ text: 'OTP sent to your email!', type: 'success' });
      setStep(2);
    } catch (err) {
      setMessage({ text: 'Network error. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${apiUrl}users/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || 'Invalid OTP', type: 'error' });
        return;
      }

      setMessage({ text: 'OTP verified!', type: 'success' });
      setStep(3);
    } catch (err) {
      setMessage({ text: 'Network error. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}users/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || 'Reset failed', type: 'error' });
        return;
      }

      setMessage({ text: 'Password reset successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ text: 'Network error. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${apiUrl}users/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ text: data.error || 'Failed to resend', type: 'error' });
        return;
      }
      setMessage({ text: 'New OTP sent to your email!', type: 'success' });
    } catch {
      setMessage({ text: 'Network error. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Forgot Password', 'Verify OTP', 'Reset Password'];
  const stepDesc = [
    'Enter your email to receive an OTP',
    `OTP sent to ${email}`,
    'Enter your new password',
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b3b7a] via-[#5a5fa3] to-[#9169a1] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700 mb-1">
              {stepTitles[step - 1]}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {stepDesc[step - 1]}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step === s
                    ? 'bg-indigo-600 text-white'
                    : step > s
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-0.5 ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {message.text && (
                <div className={`p-2 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-1 duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <div className="text-center text-gray-600 text-sm mt-2">
                Remember your password?{' '}
                <button
                  type="button"
                  className="text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  Login here
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-center text-2xl tracking-widest font-bold"
                />
              </div>

              {message.text && (
                <div className={`p-2 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-1 duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center text-sm text-gray-600">
                Didn't receive OTP?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {message.text && (
                <div className={`p-2 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-1 duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}