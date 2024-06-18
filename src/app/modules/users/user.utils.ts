import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import adminModel from '../admin/admin.model';
import facultyModel from '../faculty/faculty.model';
import { userModel } from './user.model';

const getLastStudentId = async () => {
  const lastStudent = await userModel
    .findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent?.id : undefined;
};

export const generateStudentId = async (payload: IAcademicSemester) => {
  let currentId = (0).toString();
  // 2023 03 0001
  const lastStudentId = await getLastStudentId();
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const currentStudentSemesterYear = payload.year;
  const currentStudentSemesterCode = payload.code;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentStudentSemesterCode &&
    lastStudentSemesterYear === currentStudentSemesterYear
  ) {
    // add one to the last four digit of the last document
    currentId = lastStudentId?.substring(6);
  }
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(4, '0');
  incrementedId = `${payload.year}${payload.code}${incrementedId}`;
  return incrementedId;
};

export const generateFacultyId = async () => {
  let lastFacultyIdDigit = (0).toString();
  const lastFaculty = await facultyModel
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .select('id -_id');

  // [ { id: 'F-0003' } ]
  if (lastFaculty.length > 0) {
    const lastFacultyId = lastFaculty[0].id;
    lastFacultyIdDigit = lastFacultyId.substring(2);
  }

  const fourDigitId = (parseInt(lastFacultyIdDigit) + 1)
    .toString()
    .padStart(4, '0');
  const id = `F-${fourDigitId}`;
  return id;
};
export const generateAdminId = async () => {
  let lastAdminIdDigit = (0).toString();
  const lastAdmin = await adminModel
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .select('id -_id');

  // [ { id: 'F-0003' } ]
  if (lastAdmin.length > 0) {
    const lastAdminId = lastAdmin[0].id;
    lastAdminIdDigit = lastAdminId.substring(2);
  }

  const fourDigitId = (parseInt(lastAdminIdDigit) + 1)
    .toString()
    .padStart(4, '0');
  const id = `A-${fourDigitId}`;
  return id;
};
