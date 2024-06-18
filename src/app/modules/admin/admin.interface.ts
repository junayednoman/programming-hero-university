import { Types } from 'mongoose';

export type TName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TAdmin = {
  name: TName;
  email: string;
  id: string;
  designation: string;
  user: Types.ObjectId;
  gender: 'male' | 'female';
  dateOfBirth?: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  isDeleted: boolean;
  profileImage: string;
};
