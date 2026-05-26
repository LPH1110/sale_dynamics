import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import AuthLayout from '@/layouts/AuthLayout';

export const Activation: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <EnvelopeIcon className="w-16 h-16 text-brand-500 animate-pulse" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Activate Your Account
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 px-2">
          An activation email has been generated for staff member #{userId}. Please check your inbox or contact your administrator to receive your secure verification link.
        </p>
        <div className="mt-4 w-full">
          <Link
            to="/sign-in"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-md transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Activation;
