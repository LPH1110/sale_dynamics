import { Button, Card, Input } from '@/components/ui';
import * as userService from '@/services/user.service';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import * as z from 'zod';

const schema = z.object({
  newPass: z.string().min(8, 'Password must be at least 8 characters long'),
  repeatPass: z.string(),
}).refine((data) => data.newPass === data.repeatPass, {
  message: 'Passwords must match',
  path: ['repeatPass'],
});

type FormData = z.infer<typeof schema>;

export const ChangePassword: React.FC = () => {
  const { username } = useParams<{ username: string }>();


  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!username) return;
    setIsLoading(true);
    try {
      await userService.changePassword(username, data.newPass);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
        <Card className="max-w-md w-full text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircleIcon className="w-16 h-16 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Password Changed Successfully!
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Your credentials have been securely updated. You can now proceed to log in.
          </p>
          <div className="pt-2">
            <Link to="/sign-in">
              <Button className="w-full">Sign In</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <Card className="max-w-md w-full space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
            Change Password
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Create a secure password containing at least 8 characters.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            error={errors.newPass?.message}
            {...register('newPass')}
          />
          <Input
            label="Repeat Password"
            type="password"
            error={errors.repeatPass?.message}
            {...register('repeatPass')}
          />

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
