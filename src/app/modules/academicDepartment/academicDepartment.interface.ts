import { Types } from 'mongoose';
export interface IAcademicDepartment {
  name: string;
  academicFaculty: Types.ObjectId;
}
