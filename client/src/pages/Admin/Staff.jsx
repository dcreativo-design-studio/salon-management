// src/pages/Admin/Staff.jsx
import React, { useEffect, useState } from 'react';
import { FaEdit, FaEnvelope, FaExchangeAlt, FaImage, FaPhone, FaPlus, FaSearch, FaTrash, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/Layout/AdminSidebar';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Mock data for staff - in a real app, this would come from an API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Simulate API call with timeout
        setTimeout(() => {
          // Mock specialties
          const mockSpecialties = ['haircuts', 'coloring', 'highlights', 'balayage', 'styling', 'extensions', 'treatments', 'updos', 'bridal'];
          setSpecialties(mockSpecialties);

          // Mock staff data
          const mockStaff = [
            {
              _id: 'staff-1',
              userId: {
                _id: 'user-1',
                firstName: 'Emma',
                lastName: 'Garcia',
                email: 'emma.garcia@example.com',
                phone: '+41 76 123 4567'
              },
              title: 'Senior Stylist',
              bio: 'With over 10 years of experience, Emma specializes in precision cutting and creative coloring techniques.',
              specialties: ['haircuts', 'coloring', 'balayage'],
              experience: 10,
              image: '/src/assets/images/stylist-1.jpg',
              isActive: true
            },
            {
              _id: 'staff-2',
              userId: {
                _id: 'user-2',
                firstName: 'Sophia',
                lastName: 'Martinez',
                email: 'sophia.martinez@example.com',
                phone: '+41 78 234 5678'
              },
              title: 'Color Specialist',
              bio: 'Sophia is a certified color specialist with expertise in creating natural-looking highlights and balayage.',
              specialties: ['coloring', 'highlights', 'balayage'],
              experience: 8,
              image: '/src/assets/images/stylist-2.jpg',
              isActive: true
            },
            {
              _id: 'staff-3',
              userId: {
                _id: 'user-3',
                firstName: 'Olivia',
                lastName: 'Johnson',
                email: 'olivia.johnson@example.com',
                phone: '+41 79 345 6789'
              },
              title: 'Stylist',
              bio: 'Olivia has a passion for creating personalized styles that enhance each client\'s unique features.',
              specialties: ['haircuts', 'styling', 'updos'],
              experience: 5,
              image: '/src/assets/images/stylist-3.jpg',
              isActive: true
            },
            {
              _id: 'staff-4',
              userId: {
                _id: 'user-4',
                firstName: 'Isabella',
                lastName: 'Brown',
                email: 'isabella.brown@example.com',
                phone: '+41 77 456 7890'
              },
              title: 'Extensions Specialist',
              bio: 'Isabella is trained in various extension methods and loves helping clients achieve their dream length and volume.',
              specialties: ['extensions', 'styling', 'treatments'],
              experience: 7,
              image: '/src/assets/images/stylist-4.jpg',
              isActive: true
            },
            {
              _id: 'staff-5',
              userId: {
                _id: 'user-5',
                firstName: 'Mia',
                lastName: 'Smith',
                email: 'mia.smith@example.com',
                phone: '+41 76 567 8901'
              },
              title: 'Bridal Specialist',
              bio: 'Mia creates stunning bridal looks and special occasion styles that make every client feel beautiful.',
              specialties: ['bridal', 'updos', 'styling'],
              experience: 9,
              image: '/src/assets/images/stylist-5.jpg',
              isActive: false
            }
          ];

          // Filter staff by specialty and search query
          let filteredStaff = mockStaff;

          if (filterSpecialty) {
            filteredStaff = filteredStaff.filter(member =>
              member.specialties.includes(filterSpecialty)
            );
          }

          if (searchQuery) {
            filteredStaff = filteredStaff.filter(member =>
              member.userId.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              member.userId.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              member.bio.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          setStaff(filteredStaff);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast.error('Failed to load staff');
        setLoading(false);
      }
    };

    fetchData();
  }, [filterSpecialty, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will handle the search
  };

  const openStaffModal = (staffMember = null) => {
    setSelectedStaff(staffMember);
    setIsModalOpen(true);
  };

  const closeStaffModal = () => {
    setSelectedStaff(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedStaff(null);
    setIsDeleteModalOpen(false);
  };

  const openImageModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedStaff(null);
    setIsImageModalOpen(false);
  };

  const handleStaffFormSubmit = (e) => {
    e.preventDefault();

    toast.success(selectedStaff ? 'Staff member updated successfully' : 'Staff member added successfully');
    closeStaffModal();
  };

  const handleDeleteStaff = () => {
    toast.success('Staff member deleted successfully');
    closeDeleteModal();
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    toast.success('Image uploaded successfully');
    closeImageModal();
  };

  const toggleStaffStatus = (staffMember) => {
    // Toggle active status
    const updatedStaff = { ...staffMember, isActive: !staffMember.isActive };

    // In a real app, you would make an API call here
    toast.success(`Staff member ${updatedStaff.isActive ? 'activated' : 'deactivated'} successfully`);

    // Update local state
    setStaff(staff.map(s => s._id === staffMember._id ? updatedStaff : s));
  };

  // Format specialty name for display
  const formatSpecialtyName = (specialty) => {
    return specialty.charAt(0).toUpperCase() + specialty.slice(1);
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <AdminSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-1">Staff</h1>
            <p className="text-neutral-600">
              Manage your salon stylists and their profiles.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              className="btn-primary flex items-center"
              onClick={() => openStaffModal()}
            >
              <FaPlus className="mr-2" />
              Add New Staff
            </button>
          </div>
        </div>

        {/* Staff Table */}
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
                    placeholder="Search staff..."
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

              {/* Specialty Filter */}
              <div>
                <select
                  className="form-input"
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {formatSpecialtyName(specialty)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : staff.length === 0 ? (
              <div className="p-6 text-center">
                <FaUserTie className="mx-auto text-neutral-300 text-4xl mb-4" />
                <h3 className="text-lg font-medium mb-2">No Staff Found</h3>
                <p className="text-neutral-500 mb-4">
                  There are no staff members matching your search criteria.
                </p>
                {(searchQuery || filterSpecialty) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterSpecialty('');
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
                    <th className="px-6 py-3 font-medium">Stylist</th>
                    <th className="px-6 py-3 font-medium">Contact</th>
                    <th className="px-6 py-3 font-medium">Specialties</th>
                    <th className="px-6 py-3 font-medium">Experience</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {staff.map((member) => (
                    <tr key={member._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-neutral-200 flex-shrink-0">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={`${member.userId.firstName} ${member.userId.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-neutral-400">
                                <FaUserTie size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{member.userId.firstName} {member.userId.lastName}</div>
                            <div className="text-sm text-neutral-500">{member.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-neutral-500 mb-1">
                          <FaEnvelope className="mr-2" />
                          <a href={`mailto:${member.userId.email}`} className="hover:text-primary">
                            {member.userId.email}
                          </a>
                        </div>
                        <div className="flex items-center text-sm text-neutral-500">
                          <FaPhone className="mr-2" />
                          <a href={`tel:${member.userId.phone}`} className="hover:text-primary">
                            {member.userId.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                            >
                              {formatSpecialtyName(specialty)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{member.experience} years</div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                            member.isActive
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${
                            member.isActive ? 'bg-green-600' : 'bg-red-600'
                          }`}></span>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openImageModal(member)}
                            className="text-neutral-500 hover:text-primary"
                            title="Update Image"
                          >
                            <FaImage />
                          </button>
                          <button
                            onClick={() => openStaffModal(member)}
                            className="text-neutral-500 hover:text-primary"
                            title="Edit Staff"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => toggleStaffStatus(member)}
                            // src/pages/Admin/Staff.jsx (continued)
                            className={`${
                                member.isActive
                                  ? 'text-green-500 hover:text-red-500'
                                  : 'text-red-500 hover:text-green-500'
                              }`}
                              title={member.isActive ? 'Deactivate Staff' : 'Activate Staff'}
                            >
                              <FaExchangeAlt />
                            </button>
                            <button
                              onClick={() => openDeleteModal(member)}
                              className="text-neutral-500 hover:text-red-500"
                              title="Delete Staff"
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

        {/* Staff Modal - Create/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl my-8">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h3 className="text-lg font-medium">
                  {selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h3>
              </div>

              <form onSubmit={handleStaffFormSubmit}>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        className="form-input"
                        defaultValue={selectedStaff?.userId?.firstName || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        className="form-input"
                        defaultValue={selectedStaff?.userId?.lastName || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="form-input"
                        defaultValue={selectedStaff?.userId?.email || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        className="form-input"
                        defaultValue={selectedStaff?.userId?.phone || ''}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="title" className="form-label">Title</label>
                      <select
                        id="title"
                        className="form-input"
                        defaultValue={selectedStaff?.title || ''}
                        required
                      >
                        <option value="">Select Title</option>
                        <option value="Senior Stylist">Senior Stylist</option>
                        <option value="Stylist">Stylist</option>
                        <option value="Junior Stylist">Junior Stylist</option>
                        <option value="Color Specialist">Color Specialist</option>
                        <option value="Extensions Specialist">Extensions Specialist</option>
                        <option value="Bridal Specialist">Bridal Specialist</option>
                        <option value="Manager">Manager</option>
                        <option value="Assistant">Assistant</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="experience" className="form-label">Experience (years)</label>
                      <input
                        type="number"
                        id="experience"
                        className="form-input"
                        min="0"
                        defaultValue={selectedStaff?.experience || ''}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="bio" className="form-label">Bio</label>
                      <textarea
                        id="bio"
                        className="form-input"
                        rows="3"
                        defaultValue={selectedStaff?.bio || ''}
                        required
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Specialties</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {specialties.map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              value={specialty}
                              defaultChecked={selectedStaff?.specialties?.includes(specialty)}
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span>{formatSpecialtyName(specialty)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="isActive" className="form-label">Status</label>
                      <select
                        id="isActive"
                        className="form-input"
                        defaultValue={selectedStaff?.isActive !== undefined ? selectedStaff.isActive : true}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {!selectedStaff && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-700 mb-2">Account Setup</h4>
                      <p className="text-blue-600 text-sm mb-2">
                        A new user account will be created for this staff member. They will receive an email with login instructions.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="password" className="form-label text-blue-700">Temporary Password</label>
                          <input
                            type="password"
                            id="password"
                            className="form-input border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                            placeholder="Enter temporary password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedStaff && (
                    <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium mb-1">Staff Image</h4>
                          <p className="text-sm text-neutral-500">
                            Update the profile image for this staff member.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-primary hover:text-primary-dark"
                          onClick={() => {
                            closeStaffModal();
                            openImageModal(selectedStaff);
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
                    onClick={closeStaffModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    {selectedStaff ? 'Update Staff Member' : 'Add Staff Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h3 className="text-lg font-medium text-red-600">Delete Staff Member</h3>
              </div>

              <div className="p-6">
                <p className="mb-4">
                  Are you sure you want to delete <span className="font-medium">{selectedStaff.userId.firstName} {selectedStaff.userId.lastName}</span>?
                  This action cannot be undone.
                </p>

                <p className="text-neutral-500 text-sm">
                  Note: This will remove the staff profile and their user account. All appointment history will be preserved.
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
                  onClick={handleDeleteStaff}
                >
                  Delete Staff
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {isImageModalOpen && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h3 className="text-lg font-medium">Update Staff Image</h3>
              </div>

              <form onSubmit={handleImageUpload}>
                <div className="p-6">
                  <div className="mb-6">
                    <div className="mb-4 flex justify-center">
                      <div className="h-40 w-40 rounded-full overflow-hidden bg-neutral-200">
                        {selectedStaff.image ? (
                          <img
                            src={selectedStaff.image}
                            alt={`${selectedStaff.userId.firstName} ${selectedStaff.userId.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-neutral-400">
                            <FaUserTie size={32} />
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
                      Recommended size: 500x500 pixels. Max file size: 2MB.
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

  export default Staff;
