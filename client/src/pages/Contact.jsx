// src/pages/Contact.jsx
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { FaCheck, FaClock, FaEnvelope, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhone, FaSpinner, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Contact form schema validation
  const contactSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .matches(
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        'Phone number is not valid'
      )
      .required('Phone number is required'),
    subject: Yup.string()
      .required('Subject is required'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Simulate API call
    setTimeout(() => {
      // In a real application, you would send this data to your API
      console.log('Form values:', values);

      // Show success message
      setFormSubmitted(true);
      toast.success('Message sent successfully! We will contact you soon.');

      // Reset form
      resetForm();
      setSubmitting(false);

      // Reset success message after a while
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/contact-hero.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent z-10"></div>

        <div className="container-custom h-full flex items-center relative z-20">
          <div className="max-w-xl">
            <span className="block text-primary font-medium mb-3 tracking-wider text-lg">GET IN TOUCH</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
              Contact Us
            </h1>
            <p className="text-neutral-300 text-lg">
              We'd love to hear from you. Reach out with any questions or to schedule your appointment.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Contact Information</h2>
              <p className="text-neutral-600 mb-8">
                Have questions or want to schedule an appointment? Reach out to us using any of the methods below, or fill out the form and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex">
                  <div className="mr-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <FaPhone />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Phone</h3>
                    <a href="tel:+41123456789" className="text-neutral-600 hover:text-primary">
                      +41 12 345 67 89
                    </a>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Email</h3>
                    <a href="mailto:info@beautyhaven.ch" className="text-neutral-600 hover:text-primary">
                      info@beautyhaven.ch
                    </a>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Location</h3>
                    <address className="text-neutral-600 not-italic">
                      123 Elegance Street<br />
                      Lugano, Switzerland
                    </address>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Hours</h3>
                    <div className="grid grid-cols-2 gap-2 text-neutral-600">
                      <div>Monday - Friday</div>
                      <div>9:00 - 18:00</div>
                      <div>Saturday</div>
                      <div>10:00 - 16:00</div>
                      <div>Sunday</div>
                      <div>Closed</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700 hover:bg-primary hover:text-white transition-colors"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700 hover:bg-primary hover:text-white transition-colors"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-700 hover:bg-primary hover:text-white transition-colors"
                  >
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-serif font-bold mb-6">Send Us a Message</h2>

              <Formik
                initialValues={{
                  name: '',
                  email: '',
                  phone: '',
                  subject: '',
                  message: ''
                }}
                validationSchema={contactSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label">Your Name</label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                      <ErrorMessage name="name" component="div" className="form-error mt-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="email" className="form-label">Email</label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="form-input"
                          placeholder="your@email.com"
                        />
                        <ErrorMessage name="email" component="div" className="form-error mt-1" />
                      </div>

                      <div>
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <Field
                          type="tel"
                          name="phone"
                          id="phone"
                          className="form-input"
                          placeholder="+41 12 345 67 89"
                        />
                        <ErrorMessage name="phone" component="div" className="form-error mt-1" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <Field
                        type="text"
                        name="subject"
                        id="subject"
                        className="form-input"
                        placeholder="What is your message about?"
                      />
                      <ErrorMessage name="subject" component="div" className="form-error mt-1" />
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="form-label">Message</label>
                      <Field
                        as="textarea"
                        name="message"
                        id="message"
                        rows="5"
                        className="form-input"
                        placeholder="How can we help you?"
                      />
                      <ErrorMessage name="message" component="div" className="form-error mt-1" />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Sending...
                        </>
                      ) : formSubmitted ? (
                        <>
                          <FaCheck className="mr-2" />
                          Message Sent!
                        </>
                      ) : "Send Message"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 bg-neutral-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Find Us</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              Located in the heart of Lugano, our salon is easily accessible by public transportation or car.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            {/* Embed Google Maps here (in a real app) */}
            <div className="aspect-video bg-neutral-200 rounded-lg flex items-center justify-center">
              <p className="text-neutral-600">
                [Google Maps Embed Would Be Here]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready for a Luxurious Hair Experience?
          </h2>
          <p className="max-w-2xl mx-auto text-neutral-600 mb-8">
            Skip the message and go straight to booking your appointment online. Our easy-to-use system allows you to select your preferred service, stylist, and time slot.
          </p>
          <Link
            to="/booking"
            className="btn-primary"
          >
            Book an Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contact;
