import { Schema, model } from 'mongoose';
import { IAcademicFaculty } from './academicFaculty.interface';

const academicFacultySchema = new Schema<IAcademicFaculty>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

academicFacultySchema.pre('save', async function (next) {
  const isFacultyExist = await academicFacultyModel.findOne({
    name: this.name,
  });
  if (isFacultyExist) {
    throw new Error('This faculty is already exist!');
  }
  next();
});

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isFacultyExist = await academicFacultyModel.findOne(query);
  if (!isFacultyExist) {
    throw new Error('Faculty does not exist with this Id');
  }
  next();
});

export const academicFacultyModel = model<IAcademicFaculty>(
  'academicFaculty',
  academicFacultySchema,
);
