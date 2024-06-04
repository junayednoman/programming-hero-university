import { RequestHandler } from 'express';
import { userServices } from './user.service';
import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';

const createUser: RequestHandler = catchAsyncError(async (req, res) => {
  const { password, student: studentData } = req.body;
  // const zodValidatedUser = userValidationSchema.parse(studentData);
  const result = await userServices.createStudentIntoDb(password, studentData);
  successResponse(res, {
    message: 'Successfully created user',
    data: result,
  });
});

export const UserController = { createUser };
