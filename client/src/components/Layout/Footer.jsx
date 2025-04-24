// src/components/Layout/Footer.jsx
import { FaEnvelope, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhone, FaPinterestP, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-neutral-300">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Salon Info */}
          <div>
            <div className="flex items-center mb-5">
              <img
                src="/src/assets/images/logo-white.png"
                // src/components/Layout/Footer.jsx (continued)
                alt="Beauty Haven Salon"
                className="h-14"
              />
              <div className="ml-3 font-serif">
                <h2 className="text-xl font-bold mb-0 leading-none text-white">Beauty Haven</h2>
                <p className="text-xs text-neutral-400 mb-0">LUXURY HAIR SALON</p>
              </div>
            </div>
            <p className="mb-5">
              Dedicated to enhancing your natural beauty and providing a peaceful retreat where
              you can relax, rejuvenate, and transform.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-primary mt-1 mr-3" />
                <span>123 Elegance Street, Lugano, Switzerland</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-primary mr-3" />
                <a href="tel:+41123456789" className="hover:text-primary">+41 12 345 67 89</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-primary mr-3" />
                <a href="mailto:info@beautyhaven.ch" className="hover:text-primary">info@beautyhaven.ch</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-white mb-5 after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mt-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-primary transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Client Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-white mb-5 after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mt-2">
              Opening Hours
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday</span>
                <span>9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Tuesday</span>
                <span>9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Wednesday</span>
                <span>9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Thursday</span>
                <span>9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Friday</span>
                <span>9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 - 16:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-primary">Closed</span>
              </li>
            </ul>
          </div>

          {/* Instagram Feed Placeholder */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-white mb-5 after:content-[''] after:block after:w-12 after:h-1 after:bg-primary after:mt-2">
              Follow Us
            </h3>
            <p className="mb-4">Stay updated with our latest styles, promotions, and salon news by following us on social media.</p>

            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FaFacebookF className="text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FaInstagram className="text-white" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FaPinterestP className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FaTwitter className="text-white" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-neutral-700 rounded-md overflow-hidden">
                  <img
                    src={`/src/assets/images/gallery-${item}.jpg`}
                    alt={`Gallery ${item}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-neutral-900 py-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white text-lg font-medium mb-1">Subscribe to Our Newsletter</h4>
              <p className="text-neutral-400 text-sm mb-0">Get the latest updates on promotions and new trends.</p>
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="rounded-l-md w-full md:w-64 px-4 py-2 focus:outline-none text-neutral-800"
              />
              <button className="bg-primary hover:bg-primary-dark px-4 py-2 text-white rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black py-4">
        <div className="container-custom text-center text-neutral-500">
          <p className="mb-0 text-sm">
            &copy; {currentYear} Beauty Haven Salon. All Rights Reserved.
            <span className="mx-2">|</span>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
