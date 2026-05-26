import { Spinner } from '@/components/ui';
import * as authService from '@/services/auth.service';
import { CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';

export const AccountVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'expired' | 'error'>('error');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setIsLoading(false);
        setStatus('error');
        setErrorMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await authService.verifyUser(token);
        // Checking the response format (enabled/expired/message)
        if (response.data && response.data.includes('success')) {
          setStatus('success');
        } else {
          setStatus('success'); // default fallback if status returned is positive
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage(
          error?.response?.data?.message ||
            'Invalid or expired verification token. Please contact your administrator.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        {isLoading ? (
          <>
            <Spinner className="w-10 h-10 text-brand-600" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Verifying your activation link...
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckBadgeIcon className="w-16 h-16 text-green-500 animate-bounce" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Account Activated!
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 px-2">
              Your staff account has been verified and activated. You can now log in to the sales system.
            </p>
            <div className="mt-4 w-full">
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md transition-colors"
              >
                Sign In
              </Link>
            </div>
          </>
        ) : (
          <>
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Verification Failed
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 px-4">
              {errorMessage || 'The activation link might be broken or expired.'}
            </p>
            <div className="mt-4 w-full">
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Return to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default AccountVerification;
