import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { NoSymbolIcon } from '@heroicons/react/24/outline';

export const SuspendedAccess: React.FC = () => {
  const { signout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
      <Card className="max-w-md w-full text-center space-y-6 p-8 border-red-200 dark:border-red-900/50 shadow-sm">
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <NoSymbolIcon className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Account Suspended
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Your access has been temporarily suspended by an administrator. An email has been sent with further details regarding this action. 
            <br className="my-2" />
            You no longer have permission to view or manage resources in the portal.
          </p>
        </div>
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Button onClick={signout} variant="outline" className="w-full">
            Sign Out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SuspendedAccess;
