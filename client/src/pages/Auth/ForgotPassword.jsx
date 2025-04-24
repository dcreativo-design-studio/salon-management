// src/pages/Auth/ForgotPassword.jsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  // Forgot password form schema validation
  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setFormError('');

    try {
      await forgotPassword(values.email);
      setSuccess(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
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
            <h2 className="text-2xl font-serif font-bold">Forgot Password</h2>
            <p className="text-white/80 text-sm">Enter your email to receive a password reset link</p>
          </div>

          <div className="p-8">
            {/* Success message */}
            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
                If an account exists with this email, a password reset link has been sent. Please check your inbox and follow the instructions.
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
                initialValues={{ email: '' }}
                validationSchema={forgotPasswordSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-6">
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

                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Sending Reset Link...
                        </>
                      ) : 'Send Reset Link'}
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

export default ForgotPassword;
