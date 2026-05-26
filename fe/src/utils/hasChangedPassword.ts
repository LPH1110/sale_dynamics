import { UserDTO } from '@/types/user.types';

export const hasChangedPassword = (user: UserDTO | null): boolean => {
  if (!user) return false;
  if (!user.changedPasswordDate || !user.createdDate) return true; // fallback if dates aren't set

  const changeDate = new Date(
    Array.isArray(user.changedPasswordDate)
      ? new Date(
          user.changedPasswordDate[0],
          user.changedPasswordDate[1] - 1,
          user.changedPasswordDate[2]
        ).getTime()
      : user.changedPasswordDate
  );

  const createDate = new Date(
    Array.isArray(user.createdDate)
      ? new Date(
          user.createdDate[0],
          user.createdDate[1] - 1,
          user.createdDate[2]
        ).getTime()
      : user.createdDate
  );

  return changeDate.getTime() > createDate.getTime();
};
