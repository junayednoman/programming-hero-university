import mongoose from 'mongoose';
import QueryBuilder from '../../builder/queryBuilder';
import { TCourse, TCourseFaculties } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCoursesFromDb = async (query: Record<string, unknown>) => {
  const courseSearchAbleFields = ['title', 'prefix', 'code'];
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDb = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateCourseIntoDb = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingData } = payload;

  // start a session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // update basic info
    const basicUpdate = await CourseModel.findByIdAndUpdate(id, remainingData, {
      new: true,
      runValidators: true,
      session,
    });

    if (!basicUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }

    // check if prerequisites available and delete prerequisiteCourses
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const preRequisiteCoursesToDelete = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletePrerequisiteCourse = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: preRequisiteCoursesToDelete },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletePrerequisiteCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }

      // add new prerequisite course
      const prerequisiteCourseToAdd = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      const addPrerequisiteCourse = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: { $each: { prerequisiteCourseToAdd } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!addPrerequisiteCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
    }
    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    );
    session.commitTransaction();
    session.endSession();
    return result;
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

const deleteCourseFromDb = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

// assign faculties to course
const assignFacultiesWithCourseIntoDb = async (
  id: string,
  payload: Partial<TCourseFaculties>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each:  payload  } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};

// remove faculties to course
const removeFacultiesWithCourseFromDb = async (
  id: string,
  payload: Partial<TCourseFaculties>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in:  payload  } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const courseServices = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleCourseFromDb,
  deleteCourseFromDb,
  updateCourseIntoDb,
  assignFacultiesWithCourseIntoDb,
  removeFacultiesWithCourseFromDb
};
