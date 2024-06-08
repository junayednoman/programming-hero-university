import { RequestHandler } from 'express';
import { studentServices } from './student.service';
import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';

const getAllStudents: RequestHandler = catchAsyncError(async (req, res) => {
  const result = await studentServices.getAllStudentsFromDb(req.query);
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
