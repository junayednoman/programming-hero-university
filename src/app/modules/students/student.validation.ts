import { z } from 'zod';
// Guardian Schema
const guardianValidationSchema = z.object({
  fatherName: z.string().nonempty({ message: "Father's name is required." }),
  motherName: z.string().nonempty({ message: "Mother's name is required." }),
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  fatherContact: z.string().optional(),
  motherContact: z.string().optional(),
});

// Name Schema
const nameValidationSchema = z.object({
  firstName: z.string().nonempty({ message: 'First name is required.' }),
  middleName: z.string().optional(),
  lastName: z.string().nonempty({ message: 'Last name is required.' }),
});

// Local Guardian Schema
const localGuardianValidationSchema = z.object({
  name: z.string().nonempty({ message: 'Local guardian name is required.' }),
  occupation: z.string().nonempty({ message: 'Occupation is required.' }),
  contactNo: z.string().nonempty({ message: 'Contact number is required.' }),
  address: z.string().nonempty({ message: 'Address is required.' }),
});

// Student Schema for creating
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: nameValidationSchema,
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
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      admissionDepartment: z.string(),
      profileImage: z
        .string()
        .nonempty({ message: 'Profile image is required.' }),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

// student schema for updating
const guardianUpdateValidationSchema = z
  .object({
    fatherName: z
      .string()
      .nonempty({ message: "Father's name is required." })
      .optional(),
    motherName: z
      .string()
      .nonempty({ message: "Mother's name is required." })
      .optional(),
    fatherOccupation: z.string().optional(),
    motherOccupation: z.string().optional(),
    fatherContact: z.string().optional(),
    motherContact: z.string().optional(),
  })
  .partial();

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

// Local Guardian Schema
const localGuardianUpdateValidationSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: 'Local guardian name is required.' })
      .optional(),
    occupation: z
      .string()
      .nonempty({ message: 'Occupation is required.' })
      .optional(),
    contactNo: z
      .string()
      .nonempty({ message: 'Contact number is required.' })
      .optional(),
    address: z
      .string()
      .nonempty({ message: 'Address is required.' })
      .optional(),
  })
  .partial();

// Student Schema
const studentUpdateValidationSchema = z.object({
  body: z
    .object({
      password: z.string().max(20).optional(),
      student: z
        .object({
          name: nameUpdateValidationSchema.optional(),
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
          guardian: guardianUpdateValidationSchema.optional(),
          localGuardian: localGuardianUpdateValidationSchema.optional(),
          admissionSemester: z.string().optional(),
          admissionDepartment: z.string().optional(),
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

export const studentValidations = {
  createStudentValidationSchema,
  studentUpdateValidationSchema,
};
