import { USER_ROLE } from './user.constant';

export interface IUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'blocked';
  isActive: boolean;
  isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
