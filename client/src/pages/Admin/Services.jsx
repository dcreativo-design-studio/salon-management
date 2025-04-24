// src/pages/Admin/Services.jsx
import React, { useEffect, useState } from 'react';
import { FaCut, FaEdit, FaExchangeAlt, FaImage, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/Layout/AdminSidebar';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Mock data for services - in a real app, this would come from an API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Simulate API call with timeout
        setTimeout(() => {
          // Mock categories
          const mockCategories = ['haircut', 'coloring', 'styling', 'treatment', 'extensions', 'special'];
          setCategories(mockCategories);

          // Mock services data
          const mockServices = [
            {
              _id: 'service-1',
              name: 'Women\'s Haircut',
              description: 'Precision cut customized to your face shape and hair texture.',
              price: 85,
              duration: 60,
              category: 'haircut',
              image: '/src/assets/images/service-haircut.jpg',
              isActive: true
            },
            {
              _id: 'service-2',
              name: 'Full Color',
              description: 'Complete color transformation for a fresh new look.',
              price: 120,
              duration: 120,
              category: 'coloring',
              image: '/src/assets/images/service-coloring.jpg',
              isActive: true
            },
            {
              _id: 'service-3',
              name: 'Highlights',
              description: 'Add dimension and depth with perfectly placed highlights.',
              price: 150,
              duration: 150,
              category: 'coloring',
              image: '/src/assets/images/service-coloring.jpg',
              isActive: true
            },
            {
              _id: 'service-4',
              name: 'Balayage',
              description: 'Hand-painted highlights for a natural, sun-kissed look.',
              price: 180,
              duration: 180,
              category: 'coloring',
              image: '/src/assets/images/service-coloring.jpg',
              isActive: true
            },
            {
              _id: 'service-5',
              name: 'Blowout & Style',
              description: 'Professional blowdry and styling for any occasion.',
              price: 65,
              duration: 45,
              category: 'styling',
              image: '/src/assets/images/service-styling.jpg',
              isActive: true
            },
            {
              _id: 'service-6',
              name: 'Deep Conditioning Treatment',
              description: 'Intensive moisture treatment for dry or damaged hair.',
              price: 45,
              duration: 30,
              category: 'treatment',
              image: '/src/assets/images/service-treatment.jpg',
              isActive: true
            },
            {
              _id: 'service-7',
              name: 'Hair Extensions',
              description: 'Add length and volume with premium quality extensions.',
              price: 300,
              duration: 240,
              category: 'extensions',
              image: '/src/assets/images/service-extensions.jpg',
              isActive: true
            },
            {
              _id: 'service-8',
              name: 'Bridal Hair',
              description: 'Special occasion styling for your big day.',
              price: 150,
              duration: 90,
              category: 'special',
              image: '/src/assets/images/service-special.jpg',
              isActive: true
            }
          ];

          // Filter services by category and search query
          let filteredServices = mockServices;

          if (activeCategory !== 'all') {
            filteredServices = filteredServices.filter(service => service.category === activeCategory);
          }

          if (searchQuery) {
            filteredServices = filteredServices.filter(service =>
              service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          setServices(filteredServices);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will handle the search
  };

  const openServiceModal = (service = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedService(null);
    setIsDeleteModalOpen(false);
  };

  const openImageModal = (service) => {
    setSelectedService(service);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedService(null);
    setIsImageModalOpen(false);
  };

  const handleServiceFormSubmit = (e) => {
    e.preventDefault();

    toast.success(selectedService ? 'Service updated successfully' : 'Service added successfully');
    closeServiceModal();
  };

  const handleDeleteService = () => {
    toast.success('Service deleted successfully');
    closeDeleteModal();
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    toast.success('Image uploaded successfully');
    closeImageModal();
  };

  const toggleServiceStatus = (service) => {
    // Toggle active status
    const updatedService = { ...service, isActive: !service.isActive };

    // In a real app, you would make an API call here
    toast.success(`Service ${updatedService.isActive ? 'activated' : 'deactivated'} successfully`);

    // Update local state
    setServices(services.map(s => s._id === service._id ? updatedService : s));
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <AdminSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-1">Services</h1>
            <p className="text-neutral-600">
              Manage your salon services, pricing, and descriptions.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              className="btn-primary flex items-center"
              onClick={() => openServiceModal()}
            >
              <FaPlus className="mr-2" />
              Add New Service
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    className="form-input pl-10 w-full"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Search
                </button>
              </form>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    activeCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {formatCategoryName(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="p-6 text-center">
                <FaCut className="mx-auto text-neutral-300 text-4xl mb-4" />
                <h3 className="text-lg font-medium mb-2">No Services Found</h3>
                <p className="text-neutral-500 mb-4">
                  There are no services matching your search criteria.
                </p>
                {(searchQuery || activeCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full min-w-full table-auto">
                <thead>
                  <tr className="bg-neutral-50 text-left text-neutral-500 text-sm">
                    <th className="px-6 py-3 font-medium">Service</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    // src/pages/Admin/Services.jsx (continued)
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium">Duration</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {services.map((service) => (
                    <tr key={service._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="h-12 w-12 rounded-lg overflow-hidden mr-3 bg-neutral-200 flex-shrink-0">
                            {service.image ? (
                              <img
                                src={service.image}
                                alt={service.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-neutral-400">
                                <FaCut size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-neutral-500 line-clamp-2">
                              {service.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs">
                          {formatCategoryName(service.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">${service.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{service.duration} min</div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                            service.isActive
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${
                            service.isActive ? 'bg-green-600' : 'bg-red-600'
                          }`}></span>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openImageModal(service)}
                            className="text-neutral-500 hover:text-primary"
                            title="Update Image"
                          >
                            <FaImage />
                          </button>
                          <button
                            onClick={() => openServiceModal(service)}
                            className="text-neutral-500 hover:text-primary"
                            title="Edit Service"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => toggleServiceStatus(service)}
                            className={`${
                              service.isActive
                                ? 'text-green-500 hover:text-red-500'
                                : 'text-red-500 hover:text-green-500'
                            }`}
                            title={service.isActive ? 'Deactivate Service' : 'Activate Service'}
                          >
                            <FaExchangeAlt />
                          </button>
                          <button
                            onClick={() => openDeleteModal(service)}
                            className="text-neutral-500 hover:text-red-500"
                            title="Delete Service"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Service Modal - Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="text-lg font-medium">
                {selectedService ? 'Edit Service' : 'Add New Service'}
              </h3>
            </div>

            <form onSubmit={handleServiceFormSubmit}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="form-label">Service Name</label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      defaultValue={selectedService?.name || ''}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      id="description"
                      className="form-input"
                      rows="3"
                      defaultValue={selectedService?.description || ''}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="price" className="form-label">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      className="form-input"
                      min="0"
                      step="0.01"
                      defaultValue={selectedService?.price || ''}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      id="duration"
                      className="form-input"
                      min="5"
                      step="5"
                      defaultValue={selectedService?.duration || ''}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                      id="category"
                      className="form-input"
                      defaultValue={selectedService?.category || ''}
                      required
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {formatCategoryName(category)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="isActive" className="form-label">Status</label>
                    <select
                      id="isActive"
                      className="form-input"
                      defaultValue={selectedService?.isActive !== undefined ? selectedService.isActive : true}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                {selectedService && (
                  <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium mb-1">Service Image</h4>
                        <p className="text-sm text-neutral-500">
                          Update the image for this service.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-primary hover:text-primary-dark"
                        onClick={() => {
                          closeServiceModal();
                          openImageModal(selectedService);
                        }}
                      >
                        <FaImage className="mr-1 inline-block" /> Change Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-neutral-50 px-6 py-4 flex justify-end space-x-3 border-t border-neutral-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                  onClick={closeServiceModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  {selectedService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="text-lg font-medium text-red-600">Delete Service</h3>
            </div>

            <div className="p-6">
              <p className="mb-4">
                Are you sure you want to delete <span className="font-medium">{selectedService.name}</span>?
                This action cannot be undone.
              </p>

              <p className="text-neutral-500 text-sm">
                Note: If there are upcoming appointments for this service, consider deactivating it instead of deleting.
              </p>
            </div>

            <div className="bg-neutral-50 px-6 py-4 flex justify-end space-x-3 border-t border-neutral-200">
              <button
                type="button"
                className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={handleDeleteService}
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {isImageModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="text-lg font-medium">Update Service Image</h3>
            </div>

            <form onSubmit={handleImageUpload}>
              <div className="p-6">
                <div className="mb-6">
                  <div className="mb-4 flex justify-center">
                    <div className="h-40 w-40 rounded-lg overflow-hidden bg-neutral-200">
                      {selectedService.image ? (
                        <img
                          src={selectedService.image}
                          alt={selectedService.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-neutral-400">
                          <FaImage size={32} />
                        </div>
                      )}
                    </div>
                  </div>

                  <label className="form-label">Upload New Image</label>
                  <input
                    type="file"
                    className="form-input pt-2"
                    accept="image/*"
                  />
                  <p className="text-sm text-neutral-500 mt-1">
                    Recommended size: 800x600 pixels. Max file size: 2MB.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 px-6 py-4 flex justify-end space-x-3 border-t border-neutral-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                  onClick={closeImageModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Upload Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
