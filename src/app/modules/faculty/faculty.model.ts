import { Schema, model } from 'mongoose';
import { TFaculty, TName } from './faculty.interface';
import { AppError } from '../../errors/appError';

const nameSchema = new Schema<TName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const facultySchema = new Schema<TFaculty>(
  {
    name: {
      type: nameSchema,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'users',
    },

    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: "Gender must be either 'male' or 'female'.",
      },
      required: true,
    },
    dateOfBirth: { type: String },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message:
          'Blood group must be one of the following: A+, A-, B+, B-, AB+, AB-, O+, O-.',
      },
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'academicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'academicDepartment',
    },
    profileImage: {
      type: String,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

//  check if Faculty exist before updating
facultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isFacultyExist = await facultyModel.findOne(query);
  if (!isFacultyExist) {
    throw new AppError(404, 'Faculty does not exist with this Id');
  }
  next();
});

const facultyModel = model<TFaculty>('faculty', facultySchema);
export default facultyModel;
