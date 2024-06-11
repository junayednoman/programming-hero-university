import { RequestHandler } from 'express';
import { studentServices } from './student.service';
import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';

const getAllStudents: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await studentServices.getAllStudentsFromDb(req.query);
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No student found!');
  }
  successResponse(res, {
    message: 'All students Retrieved successfully',
    data: result,
  });
});

const deleteStudent = catchAsyncError(async function (req, res) {
  const { studentId } = req.params;
  const result = await studentServices.deleteStudentFromDb(studentId);
  successResponse(res, {
    message: 'Student deleted successfully!',
    data: result,
  });
});

const updateStudent = catchAsyncError(async function (req, res) {
  const { studentId } = req.params;
  const updateDoc = req.body;
  const result = await studentServices.updateStudentIntoDb(
    studentId,
    updateDoc,
  );
  successResponse(res, {
    message: 'Student updated successfully!',
    data: result,
  });
});

export const studentController = {
  getAllStudents,
  deleteStudent,
  updateStudent,
};
