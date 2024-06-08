import { Schema, model } from 'mongoose';
import { IAcademicDepartment } from './academicDepartment.interface';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<IAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'academicFaculty',
      required: true,
    },
  },
  { timestamps: true },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await academicDepartmentModel.findOne({
    name: this.name,
  });
  if (isDepartmentExist) {
    throw new AppError(409, 'This department is already exist!');
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExist = await academicDepartmentModel.findOne(query);
  if (!isDepartmentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Department does not exist with this Id',
    );
  }
  next();
});

export const academicDepartmentModel = model<IAcademicDepartment>(
  'academicDepartment',
  academicDepartmentSchema,
);
