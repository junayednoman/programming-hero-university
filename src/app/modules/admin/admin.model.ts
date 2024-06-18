import { Schema, model } from 'mongoose';
import { TName } from '../students/student.interface';
import { TAdmin } from './admin.interface';

const nameSchema = new Schema<TName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const adminSchema = new Schema<TAdmin>(
  {
    name: {
      type: nameSchema,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'users',
    },

    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: "Gender must be either 'male' or 'female'.",
      },
      required: true,
    },
    dateOfBirth: { type: String },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message:
          'Blood group must be one of the following: A+, A-, B+, B-, AB+, AB-, O+, O-.',
      },
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImage: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const adminModel = model<TAdmin>('admin', adminSchema);
export default adminModel;
