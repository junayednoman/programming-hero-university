import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import catchAsyncError from '../../utils/catchAsyncError';
import successResponse from '../../utils/successResponse';
import { offeredCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsyncError(async (req, res) => {
  const data = req.body;
  const result = await offeredCourseServices.createOfferedCourseIntoDb(data);
  successResponse(res, {
    message: 'Offered course created successfully',
    data: result,
  });
});

const updateOfferedCourse = catchAsyncError(async (req, res) => {
  const data = req.body;
  const { offeredCourseId } = req.params;
  const result = await offeredCourseServices.updateOfferedCourseIntoDb(
    offeredCourseId,
    data,
  );
  successResponse(res, {
    message: 'Offered course updated successfully',
    data: result,
  });
});

const getAllOfferedCourses = catchAsyncError(async (req, res) => {
  const result = await offeredCourseServices.getAllOfferedCoursesFromDb();
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No offered course found!');
  }
  successResponse(res, {
    message: 'Offered courses retrieved successfully',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsyncError(async (req, res) => {
  const { offerCourseId } = req.params;
  const result =
    await offeredCourseServices.getSingleOfferedCourseFromDb(offerCourseId);
  if (result === null) {
    throw new AppError(httpStatus.NOT_FOUND, 'No offered course found!');
  }
  successResponse(res, {
    message: 'Offered course retrieved successfully',
    data: result,
  });
});

const deleteSingleOfferedCourse = catchAsyncError(async (req, res) => {
  const { offerCourseId } = req.params;
  const result =
    await offeredCourseServices.deleteOfferedCourseFromDb(offerCourseId);

  successResponse(res, {
    message: 'Offered course deleted successfully',
    data: result,
  });
});

export const offeredCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  deleteSingleOfferedCourse,
};
