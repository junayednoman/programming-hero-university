import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { offeredCourseValidations } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidations.offeredCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);
router.patch(
  '/:offeredCourseId',
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);
router.get('/', offeredCourseControllers.getAllOfferedCourses);
router.get('/:offerCourseId', offeredCourseControllers.getSingleOfferedCourse);
router.delete(
  '/:offerCourseId',
  offeredCourseControllers.deleteSingleOfferedCourse,
);

export const offeredCourseRoutes = router;
