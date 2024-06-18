import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { courseValidations } from './course.validation';
import { courseControllers } from './course.controller';

const router = Router();

router.post(
  '/create-course',
  validateRequest(courseValidations.createCourseValidationSchema),
  courseControllers.createCourse,
);

router.get('/', courseControllers.getAllCourses);
router.get('/:id', courseControllers.getSingleCourse);
router.delete('/:id', courseControllers.deleteCourse);

router.patch(
  '/:id',
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidations.courseFacultyValidationSchema),
  courseControllers.assignFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(courseValidations.courseFacultyValidationSchema),
  courseControllers.removeFacultiesFromCourse,
);

export const courseRoutes = router;
