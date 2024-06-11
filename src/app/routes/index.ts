import { Router } from 'express';
import { studentRoute } from '../modules/students/student.routes';
import { userRoutes } from '../modules/users/user.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepertment.routes';
import { facultyRoutes } from '../modules/faculty/faculty.routes';

const router = Router();

const apiRoutes = [
  { path: '/students', route: studentRoute },
  { path: '/users', route: userRoutes },
  { path: '/academic-semesters/', route: AcademicSemesterRoutes },
  { path: '/academic-faculties/', route: academicFacultyRoutes },
  { path: '/academic-departments/', route: academicDepartmentRoutes },
  { path: '/faculties/', route: facultyRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
