// src/pages/About.jsx
import { useEffect, useState } from 'react';
import { FaCut, FaGraduationCap, FaPaintBrush, FaQuoteLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getStaffMembers } from '../services/staffService';

const About = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getStaffMembers();
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
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
      <section className="relative h-[50vh] min-h-[400px] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/about-hero.jpg"
            alt="Salon Interior"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent z-10"></div>

        <div className="container-custom h-full flex items-center relative z-20">
          <div className="max-w-xl">
            <span className="block text-primary font-medium mb-3 tracking-wider text-lg">OUR STORY</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
              About Beauty Haven
            </h1>
            <p className="text-neutral-300 text-lg">
              A sanctuary of beauty and self-care where passion meets expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">SINCE 2008</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Journey to Excellence</h2>
              <p className="text-neutral-600 mb-6">
                Beauty Haven was founded with a vision to create a salon experience that combines technical expertise with artistic creativity, all in a welcoming and elegant environment where clients could truly relax.
              </p>
              <p className="text-neutral-600 mb-6">
                Starting as a small boutique salon in 2008, we quickly gained a reputation for our personalized service and attention to detail. Our commitment to ongoing education and staying current with the latest techniques has allowed us to grow into the premier hair salon in Lugano.
              </p>
              <p className="text-neutral-600 mb-6">
                Today, Beauty Haven continues to be guided by our founding principles: exceptional service, continuous learning, and creating a positive experience for every client who walks through our doors.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 italic text-neutral-700 mb-6">
                "Our goal is to enhance each client's natural beauty while providing a peaceful retreat where they can relax, rejuvenate, and transform."
              </blockquote>
              <p className="text-neutral-600">
                - Maria Rossi, Founder
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/src/assets/images/about-1.jpg"
                  alt="Salon History"
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <img
                  src="/src/assets/images/about-2.jpg"
                  alt="Salon Interior"
                  className="w-full h-auto rounded-lg shadow-md mt-8"
                />
              </div>
              <div className="pt-8">
                <img
                  src="/src/assets/images/about-3.jpg"
                  alt="Our Team"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-20 bg-neutral-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">OUR VALUES</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">What Sets Us Apart</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              At Beauty Haven, our core values guide everything we do, from how we train our team to how we interact with our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCut size={24} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Artistry & Excellence</h3>
              <p className="text-neutral-600">
                We believe in the perfect balance of technical skill and artistic vision. Our stylists are chosen not only for their technical abilities but also for their creative eye and attention to detail.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGraduationCap size={24} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Continuous Education</h3>
              <p className="text-neutral-600">
                The beauty industry is constantly evolving, and we are committed to staying at the forefront. Our team regularly participates in advanced training to bring the latest techniques and trends to our clients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPaintBrush size={24} />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Personalized Service</h3>
              <p className="text-neutral-600">
                We understand that every client is unique. That's why we take the time to listen and collaborate with you to create a look that enhances your natural beauty and fits your lifestyle and personality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16 md:py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">OUR EXPERTS</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Meet Our Talented Team</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              Our diverse team of stylists brings a wealth of experience and specialties to ensure that every client receives the perfect service for their needs.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

                    <p className="text-neutral-600 mb-4">{member.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.specialties && member.specialties.map((specialty, index) => (
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 bg-neutral-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">What Our Clients Say</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              Don't just take our word for it – hear what our clients have to say about their experiences at Beauty Haven.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-md">
                <FaQuoteLeft className="text-primary/20 text-4xl mb-4" />
                <p className="text-neutral-600 italic mb-6">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
            Ready to Experience Beauty Haven?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Book your appointment today and discover why our clients keep coming back. Our team is excited to meet you and help you look and feel your best.
          </p>
          <Link
            to="/booking"
            className="bg-white hover:bg-neutral-100 text-primary py-3 px-8 rounded-md font-medium transition-colors inline-block"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
