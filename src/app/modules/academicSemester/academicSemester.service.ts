import { academicSemesterNamesCodeMapper } from './academicSemester.constant';
import { IAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

const createAcademicSemesterIntoDb = async (payload: IAcademicSemester) => {
  if (academicSemesterNamesCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code!');
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

const getAcademicSemesterFromDb = async () => {
  const result = await AcademicSemesterModel.find();
  return result;
};

const getSingleAcademicSemesterFromDb = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id);
  return result;
};

const updateAcademicSemesterIntoDb = async (
  id: string,
  payload: Partial<IAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNamesCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid semester code!');
  }
  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDb,
  getAcademicSemesterFromDb,
  getSingleAcademicSemesterFromDb,
  updateAcademicSemesterIntoDb,
};
