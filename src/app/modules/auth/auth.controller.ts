import successResponse from '../../utils/successResponse';
import catchAsyncError from '../../utils/catchAsyncError';
import { authServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsyncError(async (req, res) => {
  const data = req.body;
  const result = await authServices.loginUser(data);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  successResponse(res, {
    message: 'User logged in successfully',
    data: { accessToken, needsPasswordChange },
  });
});

const changePassword = catchAsyncError(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await authServices.changePasswordFromDb(
    req.user,
    passwordData,
  );
  successResponse(res, {
    message: 'Password changed successfully',
    data: result,
  });
});

const refreshToken = catchAsyncError(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  successResponse(res, {
    message: 'Access token generated successfully',
    data: result,
  });
});

export const authControllers = { loginUser, changePassword, refreshToken };
