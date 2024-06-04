import { RequestHandler } from 'express';
import { studentServices } from './student.service';
import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';

const retrieveStudents: RequestHandler = catchAsyncError(
  async (req, res) => {
    const result = await studentServices.getAllStudents();
    successResponse(res, {
      message: 'student Retrieved successfully',
      data: result,
    });
  },
);

export const studentController = { retrieveStudents };
