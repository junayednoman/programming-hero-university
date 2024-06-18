import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import { semesterRegistrationValidations } from './semesterRegistration.validation';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);
router.get('/', semesterRegistrationControllers.getAllSemesterRegistrations);
router.get(
  '/:semesterRegistrationId',
  semesterRegistrationControllers.getSingleSemesterRegistrations,
);

router.patch(
  '/:semesterRegistrationId',
  validateRequest(
    semesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSingleSemesterRegistrations,
);

router.delete(
  '/:semesterRegistrationId',
  semesterRegistrationControllers.deleteSingleSemesterRegistrations,
);

export const semesterRegistrationRoutes = router;
