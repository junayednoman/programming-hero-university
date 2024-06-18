import { TOfferedCourse } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';
import mongoose, { Schema, model } from 'mongoose';

const OfferedCourseSchema = new mongoose.Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'semesterRegistration',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'academicSemester',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'academicDepartment',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'academicFaculty',
      required: true,
    },
    course: { type: Schema.Types.ObjectId, ref: 'course', required: true },
    faculty: { type: Schema.Types.ObjectId, ref: 'faculty', required: true },
    maxCapacity: { type: Number, required: true },
    section: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    days: [{
      type: String,
      enum: Days,
      required: true,
    }],
  },
  {
    timestamps: true,
  },
);

export const OfferedCourseModel = model<TOfferedCourse>('offeredCourse', OfferedCourseSchema)