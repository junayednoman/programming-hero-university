import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { userModel } from './user.model';

const getLastStudentId = async () => {
  const lastStudent = await userModel
    .findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent?.id.substring(6) : undefined;
};

export const generateStudentId = async (payload: IAcademicSemester) => {
  const currentId = (await getLastStudentId()) || (0).toString();
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, '0');
  incrementedId = `${payload.year}${payload.code}${incrementedId}`;
  return incrementedId;
};
