import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import catchAsyncError from '../../utils/catchAsyncError';
import successResponse from '../../utils/successResponse';
import { semesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsyncError(async (req, res) => {
  const data = req.body;
  const result =
    await semesterRegistrationServices.createSemesterRegistrationIntoDb(data);
  successResponse(res, {
    message: 'Semester registered successfully',
    data: result,
  });
});

const getAllSemesterRegistrations = catchAsyncError(async (req, res) => {
  const result =
    await semesterRegistrationServices.getAllSemesterRegistrationFromDb(
      req.query,
    );
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No semester registration found!');
  }
  successResponse(res, {
    message: 'Semester registration retrieved successfully',
    data: result,
  });
});

const getSingleSemesterRegistrations = catchAsyncError(async (req, res) => {
  const { semesterRegistrationId } = req.params;
  const result =
    await semesterRegistrationServices.getSingleSemesterRegistrationFromDb(
      semesterRegistrationId,
    );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No semester registration found!');
  }
  successResponse(res, {
    message: 'Semester registration retrieved successfully',
    data: result,
  });
});

const updateSingleSemesterRegistrations = catchAsyncError(async (req, res) => {
  const { semesterRegistrationId } = req.params;
  const updateDoc = req.body;
  const result =
    await semesterRegistrationServices.updateSingleSemesterRegistration(
      semesterRegistrationId,
      updateDoc,
    );
  successResponse(res, {
    message: 'Semester registration updated successfully',
    data: result,
  });
});

const deleteSingleSemesterRegistrations = catchAsyncError(async (req, res) => {
  const { semesterRegistrationId } = req.params;
  const result =
    await semesterRegistrationServices.deleteSemesterRegistrationFromDb(
      semesterRegistrationId,
    );
  successResponse(res, {
    message: 'Semester registration deleted successfully',
    data: result,
  });
});

export const semesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistrations,
  updateSingleSemesterRegistrations,
  deleteSingleSemesterRegistrations,
};
