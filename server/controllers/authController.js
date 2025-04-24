// controllers/authController.js
const crypto = require('crypto');
const { asyncHandler } = require('../middleware/errorHandler');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Schedule = require('../models/Schedule');
const sendEmail = require('../utils/emailService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password
  });

  if (user) {
    // Create JWT token
    const token = user.getSignedJwtToken();

    // Prepare user data (without password)
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };

    // Send welcome email
    const emailContent = {
      to: user.email,
      subject: 'Welcome to Our Hair Salon',
      text: `Hello ${user.firstName},\n\nWelcome to our hair salon! Your account has been created successfully.\n\nThank you for joining us!`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Our Hair Salon!</h2>
          <p>Hello ${user.firstName},</p>
          <p>Your account has been created successfully!</p>
          <p>You can now login to book appointments, view your appointment history, and more.</p>
          <p>Thank you for joining us!</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    };

    try {
      await sendEmail(emailContent);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Continue even if email fails
    }

    // Set cookie
    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };

    res
      .status(201)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user: userData
      });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Create token
  const token = user.getSignedJwtToken();

  // User data without password
  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  };

  // If staff or admin, get additional info
  if (user.role === 'staff' || user.role === 'admin') {
    const staffInfo = await Staff.findOne({ userId: user._id });
    if (staffInfo) {
      userData.staffId = staffInfo._id;
      userData.title = staffInfo.title;
    }
  }

  // Set cookie
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(200)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userData
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const userData = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    createdAt: user.createdAt
  };

  // If staff or admin, get additional info
  if (user.role === 'staff' || user.role === 'admin') {
    const staffInfo = await Staff.findOne({ userId: user._id });
    if (staffInfo) {
      userData.staffId = staffInfo._id;
      userData.title = staffInfo.title;
      userData.specialties = staffInfo.specialties;
    }
  }

  res.status(200).json({
    success: true,
    user: userData
  });
});

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone
  };

  // Filter out undefined fields
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage
    }
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  // Check current password
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal that the user doesn't exist for security
    return res.status(200).json({
      success: true,
      message: 'If this email exists, a reset password link will be sent'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Email content
  const emailContent = {
    to: user.email,
    subject: 'Password Reset Request',
    text: `You are receiving this email because you (or someone else) has requested a password reset. Please click on the following link or paste it into your browser to complete the process: \n\n ${resetUrl} \n\n This link will expire in 10 minutes. If you did not request this, please ignore this email and your password will remain unchanged.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Password Reset Request</h2>
        <p>You are receiving this email because you (or someone else) has requested a password reset.</p>
        <p>Please click the button below to complete the process:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    `
  };

  try {
    await sendEmail(emailContent);
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Send confirmation email
  const emailContent = {
    to: user.email,
    subject: 'Password Changed Successfully',
    text: `Hello ${user.firstName},\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n\nIf you did not make this change, please contact us immediately.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Password Changed Successfully</h2>
        <p>Hello ${user.firstName},</p>
        <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
        <p>If you did not make this change, please contact us immediately.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    `
  };

  try {
    await sendEmail(emailContent);
  } catch (error) {
    console.error('Error sending password change confirmation email:', error);
    // Continue even if email fails
  }

  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Register a new staff member
// @route   POST /api/auth/staff
// @access  Private/Admin
const registerStaff = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, title, bio, specialties, experience } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Transaction to create user and staff
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create user with staff role
    const user = await User.create([{
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'staff'
    }], { session });

    const createdUser = user[0];

    // Create staff record
    const staff = await Staff.create([{
      userId: createdUser._id,
      title: title || 'Stylist',
      bio: bio || `${firstName} is a talented stylist at our salon.`,
      specialties: specialties || ['haircuts'],
      experience: experience || 0
    }], { session });

    const createdStaff = staff[0];

    // Create default schedules
    await Schedule.createDefaultSchedules(createdStaff._id, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send welcome email
    const emailContent = {
      to: createdUser.email,
      subject: 'Welcome to Our Hair Salon Team',
      text: `Hello ${createdUser.firstName},\n\nWelcome to our hair salon team! Your staff account has been created successfully.\n\nUsername: ${createdUser.email}\nTemporary Password: ${password}\n\nPlease change your password after your first login.\n\nThank you for joining us!`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Our Hair Salon Team!</h2>
          <p>Hello ${createdUser.firstName},</p>
          <p>Your staff account has been created successfully!</p>
          <p><strong>Username:</strong> ${createdUser.email}<br>
          <strong>Temporary Password:</strong> ${password}</p>
          <p>Please change your password after your first login.</p>
          <p>Thank you for joining our team!</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    };

    try {
      await sendEmail(emailContent);
    } catch (error) {
      console.error('Error sending staff welcome email:', error);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: {
        user: {
          _id: createdUser._id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
          phone: createdUser.phone,
          role: createdUser.role
        },
        staff: createdStaff
      }
    });
  } catch (error) {
    // controllers/authController.js (continued)
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  registerStaff
};
