/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import facultyModel from './faculty.model';
import { userModel } from '../users/user.model';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/queryBuilder';
import { TFaculty } from './faculty.interface';

const getAllFacultiesFromDb = async (query: Record<string, unknown>) => {
  const searchFields = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'presentAddress',
  ];

  const facultyQuery = new QueryBuilder(
    facultyModel
      .find()
      .populate('academicFaculty')
      .populate({ path: 'academicDepartment', populate: 'academicFaculty' }),
    query,
  )
    .search(searchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = facultyQuery.modelQuery;
  
  return result;
};

// delete user with transaction
const deleteFacultyFromDb = async function (id: string) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isUserDeleted = await userModel.findOneAndUpdate(
      {
        id,
      },
      { isDeleted: true },
      { new: true, session },
    );

    if (!isUserDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user!');
    }
    const isFacultyDeleted = await facultyModel
      .findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })
      .populate('user');
    if (!isFacultyDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty!');
    }

    await session.commitTransaction();
    await session.endSession();

    return isFacultyDeleted;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      error.status || httpStatus.BAD_REQUEST,
      error.message || 'Server Error!',
    );
  }
};

// update student data(primitive and non-primitive)
const updateFacultyIntoDb = async function (
  id: string,
  payload: Partial<TFaculty>,
) {
  const { name, ...remainingData } = payload;

  const updateDoc: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updateDoc[`name.${key}`] = value;
    }
  }

  const result = await facultyModel.findOneAndUpdate({ id }, updateDoc, {
    new: true,
  });
  return result;
};

export const facultyServices = {
  getAllFacultiesFromDb,
  deleteFacultyFromDb,
  updateFacultyIntoDb,
};
