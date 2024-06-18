import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { facultyController } from './faculty.controller';
import { facultyValidations } from './faculty.validation';
import authVerify from '../../middleware/auth';
import { USER_ROLE } from '../users/user.constant';
const router = express.Router();
router.get(
  '/',
  authVerify(USER_ROLE.admin, USER_ROLE.faculty),
  facultyController.getAllFaculties,
);
router.delete('/:facultyId', facultyController.deleteFaculty);
router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.facultyUpdateValidationSchema),
  facultyController.updateFaculty,
);
export const facultyRoutes = router;
