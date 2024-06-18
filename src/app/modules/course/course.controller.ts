import catchAsyncError from '../../utils/catchAsyncError';
import successResponse from '../../utils/successResponse';
import { courseServices } from './course.service';

const createCourse = catchAsyncError(async (req, res) => {
  const courseData = req.body;
  const result = await courseServices.createCourseIntoDb(courseData);
  successResponse(res, {
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsyncError(async (req, res) => {
  const result = await courseServices.getAllCoursesFromDb(req.query);
  successResponse(res, {
    message: 'All courses retrieved successfully',
    data: result,
  });
});

const getSingleCourse = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.getSingleCourseFromDb(id);
  successResponse(res, {
    message: 'Course retrieved successfully',
    data: result,
  });
});

const deleteCourse = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await courseServices.deleteCourseFromDb(id);
  successResponse(res, {
    message: 'Course deleted successfully',
    data: result,
  });
});

const updateCourse = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await courseServices.updateCourseIntoDb(id, updateData);
  successResponse(res, {
    message: 'Course updated successfully',
    data: result,
  });
});

const assignFacultiesWithCourse = catchAsyncError(async (req, res) => {
  const { courseId } = req.params;
  const {faculties} = req.body;
  const result = await courseServices.assignFacultiesWithCourseIntoDb(
    courseId,
    faculties,
  );
  successResponse(res, {
    message: 'Faculty assigned successfully',
    data: result,
  });
});

const removeFacultiesFromCourse = catchAsyncError(async (req, res) => {
  const { courseId } = req.params;
  const {faculties} = req.body;
  const result = await courseServices.removeFacultiesWithCourseFromDb(
    courseId,
    faculties,
  );
  successResponse(res, {
    message: 'Faculty removed successfully',
    data: result,
  });
});

export const courseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse
};
