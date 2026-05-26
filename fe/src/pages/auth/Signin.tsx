import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/layouts/AuthLayout';
import { Input, Button, Dialog } from '@/components/ui';

const signinSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type SigninFormData = z.infer<typeof signinSchema>;

export const Signin: React.FC = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState('');
  const [isBlockedOpen, setIsBlockedOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data: SigninFormData) => {
    setErrorMsg('');
    try {
      await signin(data.username, data.password);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Signin error:', error);
      const msg = error?.response?.data?.message || 'Invalid username or password.';
      if (msg.toLowerCase().includes('block')) {
        setIsBlockedOpen(true);
      } else {
        setErrorMsg(msg);
      }
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {errorMsg && (
          <div className="p-3 text-sm text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md animate-slide-up">
            {errorMsg}
          </div>
        )}

        <Input
          label="Username"
          placeholder="Enter your username"
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="mt-2">
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>
        </div>
      </form>

      {/* Account Blocked Alert Modal */}
      <Dialog
        isOpen={isBlockedOpen}
        onClose={() => setIsBlockedOpen(false)}
        title="Account Blocked"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            This account has been locked or suspended by the administrator. Please contact your manager to resolve this access issue.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setIsBlockedOpen(false)}>Understand</Button>
          </div>
        </div>
      </Dialog>
    </AuthLayout>
  );
};

export default Signin;
