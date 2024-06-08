import { Schema, model } from 'mongoose';
import { IAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCodes,
  AcademicSemesterMonths,
  AcademicSemesterNames,
} from './academicSemester.constant';
import { AppError } from '../../errors/appError';

const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    name: { type: String, enum: AcademicSemesterNames, required: true },
    year: { type: String, required: true },
    code: { type: String, enum: AcademicSemesterCodes, required: true },
    startMonth: { type: String, enum: AcademicSemesterMonths, required: true },
    endMonth: { type: String, enum: AcademicSemesterMonths, required: true },
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  });
  if (isSemesterExist) {
    throw new AppError(409, 'Academic semester already exist!');
  }
  next();
});

//  check if semester exist before updating
academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isSemesterExist = await AcademicSemesterModel.findOne(query);
  if (!isSemesterExist) {
    throw new AppError(404, 'Semester does not exist with this Id');
  }
  next();
});

export const AcademicSemesterModel = model<IAcademicSemester>(
  'academicSemester',
  academicSemesterSchema,
);
