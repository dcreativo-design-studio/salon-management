// src/pages/Auth/ResetPassword.jsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const { resetPassword } = useContext(AuthContext);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Reset password form schema validation
  const resetSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setFormError('');

    try {
      await resetPassword(resetToken, values.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-100">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary py-6 px-8 text-white text-center">
            <h2 className="text-2xl font-serif font-bold">Reset Password</h2>
            <p className="text-white/80 text-sm">Enter your new password</p>
          </div>

          <div className="p-8">
            {/* Success message */}
            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                Your password has been reset successfully! Redirecting to login page...
              </div>
            )}

            {/* Display form errors */}
            {formError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {formError}
              </div>
            )}

            {!success && (
              <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={resetSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-6">
                      <label htmlFor="password" className="form-label">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-neutral-400" />
                        </div>
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          className="form-input pl-10"
                          placeholder="••••••••"
                        />
                      </div>
                      <ErrorMessage name="password" component="div" className="form-error mt-1" />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="text-neutral-400" />
                        </div>
                        <Field
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          className="form-input pl-10"
                          placeholder="••••••••"
                        />
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="form-error mt-1" />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Resetting Password...
                        </>
                      ) : 'Reset Password'}
                    </button>
                  </Form>
                )}
              </Formik>
            )}

            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Remember your password?{' '}
                <Link to="/login" className="text-primary font-medium hover:text-primary-dark">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
