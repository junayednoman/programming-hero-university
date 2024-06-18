import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import QueryBuilder from '../../builder/queryBuilder';
import mongoose from 'mongoose';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';

const createSemesterRegistrationIntoDb = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;
  // check wether semester exist of not
  const isAcademicSemesterExist =
    await AcademicSemesterModel.findById(academicSemester);

  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester not found!');
  }

  const isSemesterRegistrationExist = await SemesterRegistrationModel.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered',
    );
  }

  const isUpcomingOrOngoingExist = await SemesterRegistrationModel.findOne({
    $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
  });

  if (isUpcomingOrOngoingExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `There is already an ${isUpcomingOrOngoingExist.status} semester registered!`,
    );
  }

  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

// get all semester registration from db
const getAllSemesterRegistrationFromDb = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationSearchAbleFields = ['status'];
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate('academicSemester'),
    query,
  )
    .search(semesterRegistrationSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = semesterRegistrationQuery.modelQuery;
  return result;
};

// get single semester registration from db
const getSingleSemesterRegistrationFromDb = async (id: string) => {
  const result =
    await SemesterRegistrationModel.findById(id).populate('academicSemester');
  return result;
};

// update semester registration
const updateSingleSemesterRegistration = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // trow error if this semester is ended
  const currentSemester = await SemesterRegistrationModel.findById(id);

  const currentSemesterStatus = currentSemester?.status;
  const requestedSemesterStatus = payload?.status;

  if (currentSemesterStatus === 'ENDED') {
    throw new AppError(httpStatus.CONFLICT, 'This semester is already ended');
  }
  if (currentSemesterStatus === requestedSemesterStatus) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This semester is already ${currentSemesterStatus}`,
    );
  }

  if (
    currentSemesterStatus === 'UPCOMING' &&
    requestedSemesterStatus === 'ENDED'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can not directly change status from UPCOMING to ENDED',
    );
  }

  if (
    currentSemesterStatus === 'UPCOMING' &&
    requestedSemesterStatus === 'ENDED'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can not directly change status from UPCOMING to ENDED',
    );
  }
  if (
    currentSemesterStatus === 'ONGOING' &&
    requestedSemesterStatus === 'UPCOMING'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can not revert status from ONGOING to UPCOMING',
    );
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true },
  );
  return result;
};

const deleteSemesterRegistrationFromDb = async (id: string) => {
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'No semester registration found!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isOfferedCoursesDeleted = await OfferedCourseModel.deleteMany(
      {
        semesterRegistration: id,
      },
      { session },
    );

    if (!isOfferedCoursesDeleted) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete offered courses',
      );
    }

    const result = await SemesterRegistrationModel.findByIdAndDelete(id, {
      session,
    });

    session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete semester registration',
    );
  }
};
export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationFromDb,
  getSingleSemesterRegistrationFromDb,
  updateSingleSemesterRegistration,
  deleteSemesterRegistrationFromDb,
};
