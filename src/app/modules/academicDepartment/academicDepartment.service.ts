import { AppError } from '../../errors/appError';
import { IAcademicDepartment } from './academicDepartment.interface';
import { academicDepartmentModel } from './academicDepartment.model';

const createAcademicDepartmentIntoDb = async (payload: IAcademicDepartment) => {
  const result = await academicDepartmentModel.create(payload);
  return result;
};

const getAllAcademicDepartmentsFromDb = async () => {
  const result = await academicDepartmentModel
    .find()
    .populate('academicFaculty');
  return result;
};

const getSingleAcademicDepartmentFromDb = async (id: string) => {
  const result = await academicDepartmentModel
    .findById(id)
    .populate('academicFaculty');
  if (result === null) {
    throw new AppError(404, "No academic department found with this id")
  }
  return result;
};

const updateAcademicDepartmentIntoDb = async (
  id: string,
  payload: IAcademicDepartment,
) => {
  const result = await academicDepartmentModel.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  );
  return result;
};

export const academicDepartmentServices = {
  createAcademicDepartmentIntoDb,
  updateAcademicDepartmentIntoDb,
  getAllAcademicDepartmentsFromDb,
  getSingleAcademicDepartmentFromDb,
};
