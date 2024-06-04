import { Schema, model } from 'mongoose';
import { IAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCodes,
  AcademicSemesterMonths,
  AcademicSemesterNames,
} from './academicSemester.constant';

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
    throw new Error('Academic semester already exist!');
  }
  next();
});

export const AcademicSemesterModel = model<IAcademicSemester>(
  'academicSemester',
  academicSemesterSchema,
);
