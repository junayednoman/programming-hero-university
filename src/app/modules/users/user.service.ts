import config from '../../config';
import { TStudent } from '../students/student.interface';
import studentModel from '../students/student.model';
import { IUser } from './user.interface';
import { userModel } from './user.model';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';

const createStudentIntoDb = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<IUser> = {};
  // set default password, if not given
  userData.password = password || (config.default_password as string);
  // set role
  userData.role = 'student';
  // set manual id

  const academicSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  userData.id = await generateStudentId(academicSemester as IAcademicSemester);

  const result = await userModel.create(userData);
  if (Object.keys(result).length) {
    payload.id = result.id;
    payload.user = result._id;
    const newStudent = await studentModel.create(payload);

    return newStudent;
  }
};

export const userServices = { createStudentIntoDb };
