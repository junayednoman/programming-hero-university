/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config';
import { TStudent } from '../students/student.interface';
import studentModel from '../students/student.model';
import { IUser } from './user.interface';
import { userModel } from './user.model';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { generateStudentId } from './user.utils';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AppError } from '../../errors/appError';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

const createStudentIntoDb = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<IUser> = {};
  // set default password, if not given
  userData.password = password || (config.default_password as string);
  // set role
  userData.role = 'student';
  const academicSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // set id
    userData.id = await generateStudentId(
      academicSemester as IAcademicSemester,
    );

    // create a user (transaction-1)
    const newUser = await userModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create a student (transaction-2)
    const newStudent = await studentModel.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student!');
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      error.statusCode || 500,
      error.message || 'Server error!',
    );
  }
};

export const userServices = { createStudentIntoDb };
