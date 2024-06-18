import { Schema, model } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { semesterRegistrationStatus } from './semesterRegistration.constant';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'academicSemester',
    },
    status: {
      type: String,
      enum: semesterRegistrationStatus,
      default: 'UPCOMING',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minCredits: { type: Number, default: 3 },
    maxCredits: { type: Number, default: 15 },
  },
  {
    timestamps: true,
  },
);

export const SemesterRegistrationModel = model<TSemesterRegistration>(
  'semesterRegistration',
  semesterRegistrationSchema,
);
