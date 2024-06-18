import { Router } from 'express';
import { studentRoute } from '../modules/students/student.routes';
import { userRoutes } from '../modules/users/user.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
import { academicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { academicDepartmentRoutes } from '../modules/academicDepartment/academicDepertment.routes';
import { facultyRoutes } from '../modules/faculty/faculty.routes';
import { courseRoutes } from '../modules/course/course.routes';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.routes';
import { offeredCourseRoutes } from '../modules/offeredCourse/offeredCourse.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { adminRoutes } from '../modules/admin/admin.routes';

const router = Router();

const apiRoutes = [
  { path: '/students', route: studentRoute },
  { path: '/users', route: userRoutes },
  { path: '/academic-semesters/', route: AcademicSemesterRoutes },
  { path: '/academic-faculties/', route: academicFacultyRoutes },
  { path: '/academic-departments/', route: academicDepartmentRoutes },
  { path: '/faculties/', route: facultyRoutes },
  { path: '/admins/', route: adminRoutes },
  { path: '/courses/', route: courseRoutes },
  { path: '/semester-registrations/', route: semesterRegistrationRoutes },
  { path: '/offered-courses/', route: offeredCourseRoutes },
  { path: '/auth/', route: authRoutes },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
