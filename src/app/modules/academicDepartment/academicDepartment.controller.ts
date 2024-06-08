import catchAsyncError from '../../utils/catchAsyncError';
import { academicDepartmentServices } from './academicDepartment.service';
import successResponse from '../../utils/successResponse';

const createAcademicDepartment = catchAsyncError(async (req, res) => {
  const result =
    await academicDepartmentServices.createAcademicDepartmentIntoDb(req.body);
  successResponse(res, {
    data: result,
    message: 'Academic department created successfully',
  });
});

const getAllAcademicDepartments = catchAsyncError(async (req, res) => {
  const result =
    await academicDepartmentServices.getAllAcademicDepartmentsFromDb();
  successResponse(res, {
    data: result,
    message: 'All Academic departments retrieved successfully',
  });
});

const getSingleAcademicDepartment = catchAsyncError(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await academicDepartmentServices.getSingleAcademicDepartmentFromDb(
      departmentId,
    );
  successResponse(res, {
    data: result,
    message: 'Academic department retrieved successfully',
  });
});

const updateSingleAcademicDepartment = catchAsyncError(async (req, res) => {
  const { departmentId } = req.params;
  const updateData = req.body;
  const result =
    await academicDepartmentServices.updateAcademicDepartmentIntoDb(
      departmentId,
      updateData,
    );
  successResponse(res, {
    data: result,
    message: 'Academic department updated successfully',
  });
});

export const academicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateSingleAcademicDepartment,
};
