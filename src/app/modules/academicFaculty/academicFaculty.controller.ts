import catchAsyncError from '../../utils/catchAsyncError';
import successResponse from '../../utils/successResponse';
import { academicFacultyServices } from './academicFaculty.service';

const createAcademicFaculty = catchAsyncError(async (req, res) => {
  const payload = req.body;
  const result =
    await academicFacultyServices.createAcademicFacultyIntoDb(payload);
  successResponse(res, {
    data: result,
    message: 'Academic faculty created successfully ',
  });
});

const getAllAcademicFaculties = catchAsyncError(async (req, res) => {
  const result = await academicFacultyServices.getAcademicFacultiesFromDb();
  successResponse(res, {
    data: result,
    message: 'Academic faculties retrieved successfully ',
  });
});

const getSingleAcademicFaculty = catchAsyncError(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await academicFacultyServices.getSingleAcademicFacultyFromDb(facultyId);
  successResponse(res, {
    data: result,
    message: 'Academic faculty retrieved successfully ',
  });
});

const updateSingleAcademicFaculty = catchAsyncError(async (req, res) => {
  const { facultyId } = req.params;
  const payload = req.body;

  const result = await academicFacultyServices.updateAcademicFacultyIntoDb(
    facultyId,
    payload,
  );
  successResponse(res, {
    data: result,
    message: 'Academic faculty updated successfully ',
  });
});

export const academicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateSingleAcademicFaculty,
};
