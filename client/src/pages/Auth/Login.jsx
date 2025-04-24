// src/pages/Auth/Login.jsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated, error } = useContext(AuthContext);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect URL from query params (if any)
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Login form schema validation
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setFormError('');

    try {
      await login({
        email: values.email,
        password: values.password
      });
      // If successful, the useEffect hook will handle redirection
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
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
            <h2 className="text-2xl font-serif font-bold">Sign In</h2>
            <p className="text-white/80 text-sm">Welcome back to Beauty Haven</p>
          </div>

          <div className="p-8">
            {/* Display form errors */}
            {formError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {formError}
              </div>
            )}

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
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

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                        Forgot Password?
                      </Link>
                    </div>
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
                    <label className="custom-checkbox">
                      <Field type="checkbox" name="remember" />
                      <span className="checkmark"></span>
                      <span className="ml-2 text-neutral-700">Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-medium hover:text-primary-dark">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
