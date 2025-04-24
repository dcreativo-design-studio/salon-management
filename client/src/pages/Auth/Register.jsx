// src/pages/Auth/Register.jsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { FaEnvelope, FaLock, FaPhone, FaSpinner, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const { register, isAuthenticated } = useContext(AuthContext);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Registration form schema validation
  const registerSchema = Yup.object().shape({
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
      ),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    acceptTerms: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setFormError('');

    try {
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password
      });
      // If successful, the useEffect hook will handle redirection
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-100">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary py-6 px-8 text-white text-center">
            <h2 className="text-2xl font-serif font-bold">Create an Account</h2>
            <p className="text-white/80 text-sm">Join Beauty Haven to book appointments and manage your profile</p>
          </div>

          <div className="p-8">
            {/* Display form errors */}
            {formError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {formError}
              </div>
            )}

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                acceptTerms: false
              }}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div>
                      <label htmlFor="password" className="form-label">Password</label>
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

                    <div>
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
                  </div>

                  <div className="mt-6 mb-6">
                    <label className="custom-checkbox">
                      <Field type="checkbox" name="acceptTerms" />
                      <span className="checkmark"></span>
                      <span className="ml-2 text-neutral-700">
                        I agree to the{' '}
                        <Link to="/terms-of-service" className="text-primary">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy-policy" className="text-primary">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    <ErrorMessage name="acceptTerms" component="div" className="form-error mt-1" />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <p className="text-neutral-600">
                Already have an account?{' '}
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

export default Register;
