import { RequestHandler } from 'express';
import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';
import { facultyServices } from './faculty.service';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';

const getAllFaculties: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await facultyServices.getAllFacultiesFromDb(req.query);
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No faculty found!');
  }
  successResponse(res, {
    message: 'All faculties Retrieved successfully',
    data: result,
  });
});

const deleteFaculty = catchAsyncError(async function (req, res) {
  const { facultyId } = req.params;
  const result = await facultyServices.deleteFacultyFromDb(facultyId);
  successResponse(res, {
    message: 'Faculty deleted successfully!',
    data: result,
  });
});

const updateFaculty = catchAsyncError(async function (req, res) {
  const { facultyId } = req.params;
  const updateDoc = req.body;
  const result = await facultyServices.updateFacultyIntoDb(
    facultyId,
    updateDoc,
  );
  successResponse(res, {
    message: 'Faculty updated successfully!',
    data: result,
  });
});

export const facultyController = {
  getAllFaculties,
  deleteFaculty,
  updateFaculty,
};
