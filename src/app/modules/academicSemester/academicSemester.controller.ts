import { RequestHandler } from 'express';
import catchAsyncError from '../../utils/catchAsyncError';
import { AcademicSemesterServices } from './academicSemester.service';
import successResponse from '../../utils/successResponse';

const createAcademicSemester: RequestHandler = catchAsyncError(
  async (req, res) => {
    const data = req.body;
    const result =
      await AcademicSemesterServices.createAcademicSemesterIntoDb(data);
    successResponse(res, {
      message: 'Academic semester created successfully!',
      data: result,
    });
  },
);

const getAcademicSemester = catchAsyncError(async (req, res) => {
  const result = await AcademicSemesterServices.getAcademicSemesterFromDb();
  successResponse(res, {
    message: 'Academic semesters retrieved successfully!',
    data: result,
  });
});

const getSingleAcademicSemester = catchAsyncError(async (req, res) => {
  const id = req.params.semesterId;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDb(id);
  successResponse(res, {
    message: 'Academic semester retrieved successfully!',
    data: result,
  });
});

const updateAcademicSemester = catchAsyncError(async (req, res) => {
  const id = req.params.semesterId;
  const updateData = req.body;
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDb(
    id,
    updateData,
  );
  successResponse(res, {
    message: 'Academic semester updated successfully!',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
