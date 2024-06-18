import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';
import { academicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { academicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { CourseModel } from '../course/course.model';
import facultyModel from '../faculty/faculty.model';
import { handleFacultyScheduleConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDb = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!',
    );
  }

  const academicSemester = isSemesterRegistrationExist.academicSemester;

  const isAcademicFacultyExist =
    await academicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
  }

  const isAcademicDepartmentExist =
    await academicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found!');
  }

  // check if the academic department belongs to the academic faculty
  const isDepartmentBelongToFaculty = await academicDepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The ${isAcademicDepartmentExist.name} does not belong to the ${isAcademicFacultyExist.name}`,
    );
  }

  const isCourseExist = await CourseModel.findById(course);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  const isFacultyExist = await facultyModel.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  // check if the same offered course exists with the same section and same registered semester
  const isSameEntry = await OfferedCourseModel.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (isSameEntry) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered course with the same section and same semester is already exists!',
    );
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (handleFacultyScheduleConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available from ${newSchedule.startTime} to ${newSchedule.endTime}`,
    );
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
};

const updateOfferedCourseIntoDb = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'startTime' | 'endTime' | 'days'>,
) => {
  const { faculty, startTime, endTime, days } = payload;
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  const semesterRegistrationId = isOfferedCourseExist.semesterRegistration;

  // check is the semester registration status is only upcoming
  const semesterRegistration = await SemesterRegistrationModel.findById(
    semesterRegistrationId,
  );

  if (semesterRegistration?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Only UPCOMING courses can be updated. This course is already ${semesterRegistration?.status}!`,
    );
  }

  const isFacultyExist = await facultyModel.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  // get the schedules of the faculties
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration: semesterRegistrationId,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (
    assignedSchedules[0]?._id.toString() !== id &&
    handleFacultyScheduleConflict(assignedSchedules, newSchedule)
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This faculty is not available from ${newSchedule.startTime} to ${newSchedule.endTime}`,
    );
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getAllOfferedCoursesFromDb = async () => {
  const result = await OfferedCourseModel.find()
    .populate('semesterRegistration')
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .populate('course')
    .populate('faculty');
  return result;
};

const getSingleOfferedCourseFromDb = async (id: string) => {
  const result = await OfferedCourseModel.findById(id)
    .populate('semesterRegistration')
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .populate('course')
    .populate('faculty');
  return result;
};

const deleteOfferedCourseFromDb = async (id: string) => {
  const offeredCourse = await OfferedCourseModel.findById(id);
  const semesterRegistration = await SemesterRegistrationModel.findById(
    offeredCourse?.semesterRegistration,
  );
  if (semesterRegistration?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not delete this course as it is ${semesterRegistration?.status}`,
    );
  }
  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDb,
  updateOfferedCourseIntoDb,
  getAllOfferedCoursesFromDb,
  getSingleOfferedCourseFromDb,
  deleteOfferedCourseFromDb
};
