import { Schema, model } from 'mongoose';
import {
  TCourse,
  TCourseFaculties,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'course' },
  isDeleted: { type: Boolean, default: false },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  prefix: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: Number,
    required: true,
    trim: true,
  },
  credits: {
    type: Number,
    required: true,
    trim: true,
  },
  preRequisiteCourses: [preRequisiteCoursesSchema],
  isDeleted: { type: Boolean, default: false },
});

const courseFacultySchema = new Schema<TCourseFaculties>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true,
    unique: true,
  },
  faculties: {
    type: [Schema.Types.ObjectId],
    ref: 'faculty',
    required: true,
  },
});

export const CourseFacultyModel = model<TCourseFaculties>(
  'courseFaculty',
  courseFacultySchema,
);

export const CourseModel = model<TCourse>('course', courseSchema);
