/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import adminModel from './admin.model';
import { userModel } from '../users/user.model';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/queryBuilder';
import { TAdmin } from './admin.interface';

const getAllAdminsFromDb = async (query: Record<string, unknown>) => {
  const searchFields = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'presentAddress',
  ];

  const adminQuery = new QueryBuilder(
    adminModel
      .find(),
    query,
  )
    .search(searchFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = adminQuery.modelQuery;

  return result;
};

// delete user with transaction
const deleteAdminFromDb = async function (id: string) {
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
    const isAdminDeleted = await adminModel
      .findOneAndUpdate({ id }, { isDeleted: true }, { new: true, session })
      .populate('user');
    if (!isAdminDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin!');
    }

    await session.commitTransaction();
    await session.endSession();

    return isAdminDeleted;
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
const updateAdminIntoDb = async function (
  id: string,
  payload: Partial<TAdmin>,
) {
  const { name, ...remainingData } = payload;

  const updateDoc: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updateDoc[`name.${key}`] = value;
    }
  }

  const result = await adminModel.findOneAndUpdate({ id }, updateDoc, {
    new: true,
  });
  return result;
};

export const adminServices = {
  getAllAdminsFromDb,
  deleteAdminFromDb,
  updateAdminIntoDb,
};
