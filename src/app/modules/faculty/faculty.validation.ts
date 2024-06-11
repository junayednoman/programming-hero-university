import { z } from 'zod';

// Name Schema
const nameValidationSchema = z.object({
  firstName: z.string().nonempty({ message: 'First name is required.' }),
  middleName: z.string().optional(),
  lastName: z.string().nonempty({ message: 'Last name is required.' }),
});

// Faculty Schema for creating
const createFacultyValidationSchema = z.object({
  body: z.object({
    faculty: z.object({
      name: nameValidationSchema,
      designation: z.string(),
      user: z.string().optional(),
      email: z
        .string()
        .nonempty({ message: 'Email address is required.' })
        .email({ message: 'Email is not valid.' }),
      gender: z.enum(['male', 'female'], {
        message: "Gender must be either 'male' or 'female'.",
      }),
      dateOfBirth: z.string().optional(),
      contactNo: z
        .string()
        .min(11, { message: 'Contact number must be exactly 11 digits.' })
        .max(11, { message: 'Contact number must be exactly 11 digits.' }),
      emergencyContactNo: z.string().nonempty(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
          message:
            'Blood group must be one of the following: A+, A-, B+, B-, AB+, AB-, O+, O-.',
        })
        .optional(),
      presentAddress: z
        .string()
        .nonempty({ message: 'Present address is required.' }),
      permanentAddress: z
        .string()
        .nonempty({ message: 'Permanent address is required.' }),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      profileImage: z
        .string()
        .nonempty({ message: 'Profile image is required.' }),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// Name Schema
const nameUpdateValidationSchema = z
  .object({
    firstName: z
      .string()
      .nonempty({ message: 'First name is required.' })
      .optional(),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .nonempty({ message: 'Last name is required.' })
      .optional(),
  })
  .partial();

// Faculty Schema
const facultyUpdateValidationSchema = z.object({
  body: z
    .object({
      password: z.string().max(20).optional(),
      faculty: z
        .object({
          name: nameUpdateValidationSchema.optional(),
          designation: z.string().optional(),
          user: z.string().optional(),
          email: z
            .string()
            .nonempty({ message: 'Email address is required.' })
            .email({ message: 'Email is not valid.' })
            .optional(),
          gender: z
            .enum(['male', 'female'], {
              message: "Gender must be either 'male' or 'female'.",
            })
            .optional(),
          dateOfBirth: z.string().optional(),
          contactNo: z
            .string()
            .min(11, { message: 'Contact number must be exactly 11 digits.' })
            .max(11, { message: 'Contact number must be exactly 11 digits.' })
            .optional(),
          emergencyContactNo: z.string().nonempty().optional(),
          bloodGroup: z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
              message:
                'Blood group must be one of the following: A+, A-, B+, B-, AB+, AB-, O+, O-.',
            })
            .optional(),
          presentAddress: z
            .string()
            .nonempty({ message: 'Present address is required.' })
            .optional(),
          permanentAddress: z
            .string()
            .nonempty({ message: 'Permanent address is required.' })
            .optional(),
          academicSemester: z.string().optional(),
          academicDepartment: z.string().optional(),
          profileImage: z
            .string()
            .nonempty({ message: 'Profile image is required.' })
            .optional(),
          isDeleted: z.boolean().optional(),
        })
        .partial(),
    })
    .partial(),
});

export const facultyValidations = {
  createFacultyValidationSchema,
  facultyUpdateValidationSchema,
};
