import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { facultyController } from './faculty.controller';
import { facultyValidations } from './faculty.validation';
const router = express.Router();
router.get('/', facultyController.getAllFaculties);
router.delete('/:facultyId', facultyController.deleteFaculty);
router.patch(
  '/:facultyId',
  validateRequest(facultyValidations.facultyUpdateValidationSchema),
  facultyController.updateFaculty,
);
export const facultyRoutes = router;
