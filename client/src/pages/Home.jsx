// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCut, FaGem, FaPaintBrush, FaPhone, FaSpa } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getServices } from '../services/serviceService';
import { getStaffMembers } from '../services/staffService';

const Home = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services and staff on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, staffData] = await Promise.all([
          getServices({ limit: 6 }),
          getStaffMembers({ limit: 4 })
        ]);

        setServices(servicesData.data);
        setStaff(staffData.data);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sophia Mueller',
      role: 'Regular Client',
      comment: 'The stylists here are true artists. I always leave feeling beautiful and confident with my new look. The atmosphere is so relaxing and everyone is incredibly friendly.',
      image: '/src/assets/images/testimonial-1.jpg',
    },
    {
      id: 2,
      name: 'Laura Bianchi',
      role: 'Regular Client',
      comment: 'I\'ve been coming here for years and have never been disappointed. The salon is elegant, the staff is professional, and they always stay current with the latest trends and techniques.',
      image: '/src/assets/images/testimonial-2.jpg',
    },
    {
      id: 3,
      name: 'Elena Rossi',
      role: 'New Client',
      comment: 'As someone who is very particular about my hair, I was nervous trying a new salon. But the team here listened carefully to what I wanted and delivered exactly that. I couldn\'t be happier!',
      image: '/src/assets/images/testimonial-3.jpg',
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-screen max-h-[800px] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero-bg.jpg"
            alt="Salon Interior"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent z-10"></div>

        <div className="container-custom h-full flex items-center relative z-20">
          <div className="max-w-xl md:max-w-2xl">
            <span className="block text-primary font-medium mb-3 tracking-wider text-lg">WELCOME TO BEAUTY HAVEN</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Where Beauty Meets <span className="text-primary italic">Elegance</span>
            </h1>
            <p className="text-neutral-300 text-lg mb-8">
              Experience exceptional hair care in a tranquil environment. Our expert stylists are dedicated to enhancing your natural beauty with personalized services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="btn-primary flex items-center justify-center"
              >
                <FaCalendarAlt className="mr-2" />
                Book Appointment
              </Link>
              <a
                href="tel:+41123456789"
                className="btn-outline text-white border-white hover:bg-white hover:text-primary flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-neutral-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/src/assets/images/about-salon.jpg"
                alt="Our Salon"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-8 -right-8 hidden md:block">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-5xl font-serif font-bold text-primary mb-2">15+</p>
                  <p className="text-neutral-600">Years of Excellence</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">ABOUT OUR SALON</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">A Sanctuary for Beauty and Self-Care</h2>
              <p className="text-neutral-600 mb-6">
                At Beauty Haven, we believe that everyone deserves to feel beautiful. Founded in 2008, our salon has been a trusted destination for those seeking exceptional hair care in Lugano.
              </p>
              <p className="text-neutral-600 mb-8">
                Our team of passionate stylists combines technical expertise with artistic vision to create looks that enhance your natural beauty while reflecting your personal style. We use only premium products that nourish and protect your hair.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mr-4">
                    <FaCut />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Expert Stylists</h4>
                    <p className="text-sm text-neutral-500">Professionally trained and experienced</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mr-4">
                    <FaPaintBrush />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Premium Products</h4>
                    <p className="text-sm text-neutral-500">Quality brands for the best results</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mr-4">
                    <FaSpa />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Relaxing Environment</h4>
                    <p className="text-sm text-neutral-500">Peaceful atmosphere for your comfort</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full text-primary mr-4">
                    <FaGem />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Personalized Service</h4>
                    <p className="text-sm text-neutral-500">Tailored to your unique style</p>
                  </div>
                </div>
              </div>

              <Link to="/about" className="btn-primary inline-flex">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">OUR SERVICES</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Premium Salon Services</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              From classic cuts to innovative color techniques, we offer a full range of services to help you look and feel your best.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service._id} className="card group">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image || `/src/assets/images/service-${service.category}.jpg`}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold mb-2">{service.name}</h3>
                    <p className="text-neutral-600 mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-primary">${service.price.toFixed(2)}</span>
                      <span className="text-sm text-neutral-500">{service.duration} min</span>
                    </div>
                    <Link
                      to={`/booking?service=${service._id}`}
                      className="mt-4 btn-outline block text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services" className="btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-neutral-900 text-white relative">
        <div className="absolute inset-0 bg-[url('/src/assets/images/pattern-bg.jpg')] opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">WHY CHOOSE US</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">The Beauty Haven Experience</h2>
            <p className="max-w-2xl mx-auto text-neutral-300">
              Discover what sets us apart and why our clients trust us for all their hair care needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-neutral-800/70 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Personalized Consultation</h3>
              <p className="text-neutral-300">
                Every service begins with a thorough consultation to understand your goals and hair needs.
              </p>
            </div>

            <div className="bg-neutral-800/70 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Convenient Booking</h3>
              <p className="text-neutral-300">
                Our online booking system makes it easy to schedule appointments anytime, anywhere.
              </p>
            </div>

            <div className="bg-neutral-800/70 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Expert Stylists</h3>
              <p className="text-neutral-300">
                Our team regularly trains in the latest techniques to provide exceptional service.
              </p>
            </div>

            <div className="bg-neutral-800/70 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Premium Products</h3>
              <p className="text-neutral-300">
                We use and recommend only high-quality products that are gentle on your hair.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/booking" className="btn-primary">
              Book Your Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">OUR EXPERTS</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Meet Our Talented Team</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              Our passionate stylists are dedicated to helping you look and feel your absolute best.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {staff.map((member) => (
                <div key={member._id} className="card group text-center">
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image || `/src/assets/images/stylist-${Math.floor(Math.random() * 4) + 1}.jpg`}
                      alt={member.userId?.firstName}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">

                    <h3 className="text-xl font-serif font-semibold mb-1">
                      {member.userId?.firstName} {member.userId?.lastName}
                    </h3>
                    <p className="text-primary mb-3">{member.title}</p>
                    <p className="text-neutral-600 mb-4 line-clamp-2">{member.bio}</p>
                    <div className="flex justify-center space-x-2">
                      {member.specialties && member.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/booking?staff=${member._id}`}
                      className="mt-4 btn-outline block text-center"
                    >
                      Book With {member.userId?.firstName}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/about#team" className="btn-secondary">
              Meet Our Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-neutral-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">What Our Clients Say</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              We're proud of the experiences we create for our clients. Here's what they have to say about us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{testimonial.name}</h4>
                    <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-neutral-600 italic">"{testimonial.comment}"</p>
                <div className="mt-4 flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 bg-primary">
        <div className="absolute inset-0 bg-[url('/src/assets/images/cta-pattern.jpg')] opacity-10"></div>
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">
            Ready for a Fresh New Look?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
            Book your appointment today and let our expert stylists help you achieve the look you've always wanted.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/booking"
              className="bg-white hover:bg-neutral-100 text-primary py-3 px-8 rounded-md font-medium transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white/10 py-3 px-8 rounded-md font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">INSTAGRAM</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Follow Us On Instagram</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              Stay updated with our latest styles, behind-the-scenes moments, and salon inspiration.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <a
                key={item}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={`/src/assets/images/insta-${item}.jpg`}
                    alt={`Instagram ${item}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary font-medium"
            >
              @beautyhavensalon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
