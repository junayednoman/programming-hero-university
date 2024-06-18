import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';
import { adminServices } from './admin.service';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';

const getAllAdmins = catchAsyncError(async (req, res) => {
  console.log('decoded token: ', req.user);
  const result = await adminServices.getAllAdminsFromDb(req.query);
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No admin found!');
  }
  successResponse(res, {
    message: 'All admins retrieved successfully',
    data: result,
  });
});

const deleteAdmin = catchAsyncError(async function (req, res) {
  const { adminId } = req.params;
  const result = await adminServices.deleteAdminFromDb(adminId);
  successResponse(res, {
    message: 'Admin deleted successfully!',
    data: result,
  });
});

const updateAdmin = catchAsyncError(async function (req, res) {
  const { adminId } = req.params;
  const updateDoc = req.body;
  const result = await adminServices.updateAdminIntoDb(adminId, updateDoc);
  successResponse(res, {
    message: 'Admin updated successfully!',
    data: result,
  });
});

export const adminController = {
  getAllAdmins,
  deleteAdmin,
  updateAdmin,
};
