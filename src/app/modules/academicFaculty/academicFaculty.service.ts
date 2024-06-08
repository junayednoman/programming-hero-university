import { IAcademicFaculty } from './academicFaculty.interface';
import { academicFacultyModel } from './academicFaculty.model';

const createAcademicFacultyIntoDb = async (payload: IAcademicFaculty) => {
  const result = await academicFacultyModel.create(payload);
  return result;
};

const getAcademicFacultiesFromDb = async () => {
  const result = await academicFacultyModel.find();
  return result;
};

const getSingleAcademicFacultyFromDb = async (id: string) => {
  const result = await academicFacultyModel.findById(id);
  return result;
};

const updateAcademicFacultyIntoDb = async (
  id: string,
  payload: IAcademicFaculty,
) => {
  const result = await academicFacultyModel.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  );
  return result;
};
export const academicFacultyServices = {
  createAcademicFacultyIntoDb,
  getAcademicFacultiesFromDb,
  getSingleAcademicFacultyFromDb,
  updateAcademicFacultyIntoDb,
};
