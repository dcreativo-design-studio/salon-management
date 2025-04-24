// src/pages/Services.jsx
import { useEffect, useState } from 'react';
import { FaCut, FaGem, FaLeaf, FaMagic, FaPaintBrush, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getServiceCategories, getServices } from '../services/serviceService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryIcons = {
    haircut: <FaCut />,
    coloring: <FaPaintBrush />,
    styling: <FaMagic />,
    treatment: <FaLeaf />,
    extensions: <FaGem />,
    special: <FaGem />
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          getServices(),
          getServiceCategories()
        ]);

        setServices(servicesRes.data);
        setCategories(['all', ...categoriesRes.data]);
      } catch (error) {
        console.error('Error fetching services data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services based on active category and search query
  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === 'all') return 'All Services';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    return categoryIcons[category] || <FaCut />;
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/services-hero.jpg"
            alt="Salon Services"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent z-10"></div>

        <div className="container-custom h-full flex items-center relative z-20">
          <div className="max-w-xl">
            <span className="block text-primary font-medium mb-3 tracking-wider text-lg">OUR OFFERINGS</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
              Luxury Hair Services
            </h1>
            <p className="text-neutral-300 text-lg">
              Discover our full range of premium services designed to enhance your natural beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search services..."
                  className="form-input pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Booking Button */}
              <Link to="/booking" className="btn-primary w-full md:w-auto text-center">
                Book an Appointment
              </Link>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full flex items-center transition-colors ${
                    activeCategory === category
                      ? 'bg-secondary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {formatCategoryName(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-serif font-semibold mb-3">No Services Found</h3>
              <p className="text-neutral-600 mb-6">
                We couldn't find any services matching your criteria. Please try a different search or category.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="btn-secondary"
              >
                View All Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div key={service._id} className="card group">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image || `/src/assets/images/service-${service.category}.jpg`}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-serif font-semibold">{service.name}</h3>
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full capitalize">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-neutral-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium text-primary">${service.price.toFixed(2)}</span>
                      <span className="text-sm text-neutral-500">{service.duration} min</span>
                    </div>
                    <Link
                      to={`/booking?service=${service._id}`}
                      className="btn-outline block text-center"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-neutral-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-sm text-primary font-medium uppercase tracking-wider mb-2 block">QUESTIONS & ANSWERS</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
            <p className="max-w-2xl mx-auto text-neutral-600">
              Find answers to common questions about our services and salon policies.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-3">How far in advance should I book my appointment?</h3>
                <p className="text-neutral-600">
                  We recommend booking at least 1-2 weeks in advance for regular appointments, and 3-4 weeks for special occasions to ensure you get your preferred stylist and time slot.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-3">What happens if I need to cancel or reschedule?</h3>
                <p className="text-neutral-600">
                  We understand that plans change. We request that you give us at least 24 hours' notice for cancellations or rescheduling to avoid a cancellation fee.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-3">Do you offer consultations before booking a service?</h3>
                <p className="text-neutral-600">
                  Yes, we offer complimentary 15-minute consultations for more complex services like color transformations or extensions. You can book a consultation through our online system or by giving us a call.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-3">What products do you use in the salon?</h3>
                <p className="text-neutral-600">
                  We use premium professional products that are gentle on your hair and provide exceptional results. Our main product lines include Oribe, Kérastase, and Kevin Murphy, all of which are also available for purchase in our salon.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-3">Do you have a loyalty program?</h3>
                <p className="text-neutral-600">
                  Yes, we have a loyalty program that rewards our regular clients. You'll earn points for every service and product purchase, which can be redeemed for discounts, complimentary add-on treatments, or product purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="bg-primary rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 flex items-center">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-white mb-4">
                    Ready for a Transformation?
                  </h2>
                  <p className="text-white/90 mb-8">
                    Our expert stylists are ready to help you achieve the look you've always wanted. Book your appointment today!
                  </p>
                  <Link
                    to="/booking"
                    className="bg-white hover:bg-neutral-100 text-primary py-3 px-8 rounded-md font-medium transition-colors inline-block"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
              <div className="bg-[url('/src/assets/images/cta-services.jpg')] bg-cover bg-center min-h-[300px]">
                {/* Image background */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
