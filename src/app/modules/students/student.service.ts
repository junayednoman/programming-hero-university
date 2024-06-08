/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import studentModel from './student.model';
import { userModel } from '../users/user.model';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/queryBuilder';

const getAllStudentsFromDb = async (query: Record<string, unknown>) => {
  const searchFields = ['email', 'name.firstName', 'presentAddress'];

  // const filterQueryObj = { ...query };
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query.searchTerm as string;
  // }
  // // search query
  // const searchedResult = studentModel.find({
  //   $or: searchFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // // filter query
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'pages', 'fields'];
  // excludeFields.forEach((field) => {
  //   delete filterQueryObj[field];
  // });

  // const filteredResult = searchedResult
  //   .find(filterQueryObj)
  //   .populate('admissionSemester')
  //   .populate({ path: 'admissionDepartment', populate: 'academicFaculty' });

  // // sort query
  // let sortQuery = 'createdAt';
  // if (query.sort) {
  //   sortQuery = query.sort as string;
  // }

  // const sortedResult = filteredResult.sort(sortQuery);

  // // limit query
  // let limit = 10;
  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // const limitedResult = sortedResult.limit(limit);

  // // page query
  // let pages = 1;
  // let skip = 0;
  // if (query.pages) {
  //   pages = Number(query.pages);
  //   skip = Number(pages - 1) * limit;
  // }

  // const skippedResult = limitedResult.skip(skip);

  // // limit fields
  // let fields = '';
  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const fieldsLimitedResult = await skippedResult.select(fields);
  // return fieldsLimitedResult;

  const studentQuery = new QueryBuilder(
    studentModel
      .find()
      .populate('admissionSemester')
      .populate({ path: 'admissionDepartment', populate: 'academicFaculty' }),
    query,
  )
    .search(searchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = studentQuery.modelQuery;
  return result;
};

// delete user with transaction
const deleteStudentFromDb = async function (id: string) {
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
    const isStudentDeleted = await studentModel
      .findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })
      .populate('user');
    if (!isStudentDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!');
    }

    await session.commitTransaction();
    await session.endSession();

    return isStudentDeleted;
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
const updateStudentIntoDb = async function (
  id: string,
  payload: Partial<TStudent>,
) {
  const { name, guardian, localGuardian, ...remainingData } = payload;

  const updateDoc: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updateDoc[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      updateDoc[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      updateDoc[`localGuardian.${key}`] = value;
    }
  }

  const result = await studentModel.findOneAndUpdate({ id }, updateDoc, {
    new: true,
  });
  return result;
};

export const studentServices = {
  getAllStudentsFromDb,
  deleteStudentFromDb,
  updateStudentIntoDb,
};
