// src/pages/Client/Profile.jsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { FaCheck, FaEnvelope, FaLock, FaPhone, FaSpinner, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Profile update form schema validation
  const profileSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        'Phone number is not valid'
      )
  });

  // Password update form schema validation
  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .required('New password is required')
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Handle profile update
  const handleProfileUpdate = async (values, { setSubmitting, setErrors }) => {
    try {
      await updateProfile(values);
      setProfileSuccess(true);
      toast.success('Profile updated successfully');

      // Reset success message after a delay
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMsg);

      // Check if there are field-specific errors
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.param] = err.msg;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      setPasswordSuccess(true);
      toast.success('Password updated successfully');
      resetForm();

      // Reset success message after a delay
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update password. Please try again.';
      toast.error(errorMsg);

      // Check if there are field-specific errors
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.param] = err.msg;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-neutral-100 min-h-screen">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-accent p-8 text-white">
            <h1 className="text-3xl font-serif font-bold mb-2">Profile Settings</h1>
            <p className="text-white/80">
              Manage your personal information and account settings.
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200">
            <div className="flex">
              <button
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-neutral-600 hover:text-accent'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Personal Information
              </button>
              <button
                className={`px-6 py-4 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-neutral-600 hover:text-accent'
                }`}
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Profile Update Form */}
            {activeTab === 'profile' && (
              <Formik
                initialValues={{
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  email: user?.email || '',
                  phone: user?.phone || ''
                }}
                validationSchema={profileSchema}
                onSubmit={handleProfileUpdate}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-neutral-400" />
                          </div>
                          <Field
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="form-input pl-10"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <ErrorMessage name="firstName" component="div" className="form-error mt-1" />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-neutral-400" />
                          </div>
                          <Field
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="form-input pl-10"
                            placeholder="Enter your last name"
                          />
                        </div>
                        <ErrorMessage name="lastName" component="div" className="form-error mt-1" />
                      </div>

                      <div>
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-neutral-400" />
                          </div>
                          <Field
                            type="email"
                            name="email"
                            id="email"
                            className="form-input pl-10"
                            placeholder="your@email.com"
                          />
                        </div>
                        <ErrorMessage name="email" component="div" className="form-error mt-1" />
                      </div>

                      <div>
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="text-neutral-400" />
                          </div>
                          <Field
                            type="tel"
                            name="phone"
                            id="phone"
                            className="form-input pl-10"
                            placeholder="+41 12 345 67 89"
                          />
                        </div>
                        <ErrorMessage name="phone" component="div" className="form-error mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        type="submit"
                        className="btn-primary flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Updating...
                          </>
                        ) : profileSuccess ? (
                          <>
                            <FaCheck className="mr-2" />
                            Updated!
                          </>
                        ) : 'Update Profile'}
                      </button>

                      {/* Success message */}
                      {profileSuccess && (
                        <span className="ml-4 text-green-600 flex items-center">
                          <FaCheck className="mr-1" />
                          Profile updated successfully!
                        </span>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            )}

            {/* Password Update Form */}
            {activeTab === 'password' && (
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                }}
                validationSchema={passwordSchema}
                onSubmit={handlePasswordUpdate}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="space-y-6 mb-6">
                      <div>
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-neutral-400" />
                          </div>
                          <Field
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            className="form-input pl-10"
                            placeholder="Enter your current password"
                          />
                        </div>
                        <ErrorMessage name="currentPassword" component="div" className="form-error mt-1" />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-neutral-400" />
                          </div>
                          <Field
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            className="form-input pl-10"
                            placeholder="Enter your new password"
                          />
                        </div>
                        <ErrorMessage name="newPassword" component="div" className="form-error mt-1" />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-neutral-400" />
                          </div>
                          <Field
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="form-input pl-10"
                            placeholder="Confirm your new password"
                          />
                        </div>
                        <ErrorMessage name="confirmPassword" component="div" className="form-error mt-1" />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        type="submit"
                        className="btn-primary flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Updating...
                          </>
                        ) : passwordSuccess ? (
                          <>
                            <FaCheck className="mr-2" />
                            Updated!
                          </>
                        ) : 'Change Password'}
                      </button>

                      {/* Success message */}
                      {passwordSuccess && (
                        <span className="ml-4 text-green-600 flex items-center">
                          <FaCheck className="mr-1" />
                          Password updated successfully!
                        </span>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
