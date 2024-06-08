import { Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TName,
  TStudent,
} from './student.interface';
import { AppError } from '../../errors/appError';

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, "Father's name is required."] },
  motherName: { type: String, required: [true, "Mother's name is required."] },
  fatherOccupation: { type: String },
  motherOccupation: { type: String },
  fatherContact: { type: String },
  motherContact: { type: String },
});

const nameSchema = new Schema<TName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent>(
  {
    name: {
      type: nameSchema,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
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
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'academicSemester',
    },
    admissionDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'academicDepartment',
    },
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

//  check if Student exist before updating
studentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isStudentExist = await studentModel.findOne(query);
  if (!isStudentExist) {
    throw new AppError(404, 'Student does not exist with this Id');
  }
  next();
});

const studentModel = model<TStudent>('students', studentSchema);
export default studentModel;
