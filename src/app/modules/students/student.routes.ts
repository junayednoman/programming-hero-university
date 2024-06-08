import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();
router.get('/', studentController.getAllStudents);
router.delete('/:studentId', studentController.deleteStudent);
router.patch(
  '/:studentId',
  validateRequest(studentValidations.studentUpdateValidationSchema),
  studentController.updateStudent,
);
export const studentRoute = router;
