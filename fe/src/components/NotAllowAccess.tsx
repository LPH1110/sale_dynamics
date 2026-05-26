import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export const NotAllowAccess: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Action Required
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Your account was recently created or reset. You must update your temporary password before accessing other features of the portal.
        </p>
        <div className="pt-2">
          {user && (
            <Link to={`/change-password/${user.username}`}>
              <Button className="w-full">Change Password</Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotAllowAccess;
