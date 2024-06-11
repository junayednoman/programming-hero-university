import { RequestHandler } from 'express';
import { userServices } from './user.service';
import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';

const createStudent: RequestHandler = catchAsyncError(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await userServices.createStudentIntoDb(password, studentData);
  successResponse(res, {
    message: 'Student created successfully',
    data: result,
  });
});

const createFaculty: RequestHandler = catchAsyncError(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await userServices.createFacultyIntoDb(password, facultyData);
  successResponse(res, {
    message: 'Faculty created successfully',
    data: result,
  });
});

export const UserController = { createStudent, createFaculty };
