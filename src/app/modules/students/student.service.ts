import studentModel from './student.model';

const getAllStudents = async () => {
  const result = await studentModel.find();
  return result;
};
export const studentServices = { getAllStudents };
