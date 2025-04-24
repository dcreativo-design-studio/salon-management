// src/pages/Admin/Clients.jsx
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEdit, FaEnvelope, FaPhone, FaPlus, FaSearch, FaTrash, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/Layout/AdminSidebar';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  // Mock data for clients - in a real app, this would come from an API
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);

      try {
        // Simulate API call with timeout
        setTimeout(() => {
          // Mock clients data
          const mockClients = Array.from({ length: 25 }, (_, i) => ({
            _id: `client-${i + 1}`,
            firstName: ['Anna', 'Maria', 'Sofia', 'Laura', 'Elena'][i % 5],
            lastName: ['Rossi', 'Bianchi', 'Ferrari', 'Esposito', 'Romano'][i % 5],
            email: `client${i + 1}@example.com`,
            phone: `+41 ${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000)}`,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
            appointmentsCount: Math.floor(Math.random() * 10)
          }));

          // Filter by search query
          const filteredClients = searchQuery
            ? mockClients.filter(client =>
                client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.phone.includes(searchQuery)
              )
            : mockClients;

          // Paginate
          const start = (pagination.page - 1) * pagination.limit;
          const paginatedClients = filteredClients.slice(start, start + pagination.limit);

          setClients(paginatedClients);
          setPagination({
            ...pagination,
            totalPages: Math.ceil(filteredClients.length / pagination.limit),
            totalItems: filteredClients.length
          });

          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast.error('Failed to load clients');
        setLoading(false);
      }
    };

    fetchClients();
  }, [pagination.page, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    // The useEffect will handle the search
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const openClientModal = (client = null) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeClientModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedClient(null);
    setIsDeleteModalOpen(false);
  };

  const handleClientFormSubmit = (e) => {
    e.preventDefault();

    toast.success(selectedClient ? 'Client updated successfully' : 'Client added successfully');
    closeClientModal();
  };

  const handleDeleteClient = () => {
    toast.success('Client deleted successfully');
    closeDeleteModal();
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100 pt-16 pb-12 md:pl-64">
      <AdminSidebar />

      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold mb-1">Clients</h1>
            <p className="text-neutral-600">
              Manage your salon clients and their information.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              className="btn-primary flex items-center"
              onClick={() => openClientModal()}
            >
              <FaPlus className="mr-2" />
              Add New Client
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-200">
            <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="form-input pl-10 w-full"
                  placeholder="Search clients..."
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
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : clients.length === 0 ? (
              <div className="p-6 text-center">
                <FaUser className="mx-auto text-neutral-300 text-4xl mb-4" />
                <h3 className="text-lg font-medium mb-2">No Clients Found</h3>
                <p className="text-neutral-500 mb-4">
                  There are no clients matching your search criteria.
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full min-w-full table-auto">
                <thead>
                  <tr className="bg-neutral-50 text-left text-neutral-500 text-sm">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Contact</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                    <th className="px-6 py-3 font-medium">Appointments</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                            <FaUser />
                          </div>
                          <div>
                            <div className="font-medium">{client.firstName} {client.lastName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-neutral-500 mb-1">
                          <FaEnvelope className="mr-2" />
                          <a href={`mailto:${client.email}`} className="hover:text-primary">
                            {client.email}
                          </a>
                        </div>
                        <div className="flex items-center text-sm text-neutral-500">
                          <FaPhone className="mr-2" />
                          <a href={`tel:${client.phone}`} className="hover:text-primary">
                            {client.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-neutral-500">
                          <FaCalendarAlt className="mr-2" />
                          {formatDate(client.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{client.appointmentsCount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => openClientModal(client)}
                            className="text-neutral-500 hover:text-primary"
                            title="Edit Client"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => openDeleteModal(client)}
                            className="text-neutral-500 hover:text-red-500"
                            title="Delete Client"
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

          {/* Pagination */}
          {!loading && clients.length > 0 && (
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-sm text-neutral-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of {pagination.totalItems} clients
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === 1
                      ? 'text-neutral-400 cursor-not-allowed'
                      : 'text-primary hover:bg-neutral-200'
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => {
                    // Show first, last, and pages around current page
                    return p === 1 || p === pagination.totalPages ||
                      (p >= pagination.page - 1 && p <= pagination.page + 1);
                  })
                  .map((page, i, arr) => (
                    <React.Fragment key={page}>
                      {i > 0 && arr[i - 1] !== page - 1 && (
                        <span className="px-3 py-1">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md ${
                          pagination.page === page
                            ? 'bg-primary text-white'
                            : 'text-primary hover:bg-neutral-200'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === pagination.totalPages
                      ? 'text-neutral-400 cursor-not-allowed'
                      : 'text-primary hover:bg-neutral-200'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Modal - Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="text-lg font-medium">
                {selectedClient ? 'Edit Client' : 'Add New Client'}
              </h3>
            </div>

            <form onSubmit={handleClientFormSubmit}>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="form-input"
                      defaultValue={selectedClient?.firstName || ''}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="form-input"
                      defaultValue={selectedClient?.lastName || ''}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    defaultValue={selectedClient?.email || ''}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-input"
                    defaultValue={selectedClient?.phone || ''}
                    required
                  />
                </div>

                {selectedClient && (
                  <div className="mb-4">
                    <label className="form-label">Reset Password</label>
                    <button
                      type="button"
                      className="text-primary hover:text-primary-dark font-medium text-sm"
                      onClick={() => toast.info('Password reset email sent to client')}
                    >
                      Send Password Reset Email
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-neutral-50 px-6 py-4 flex justify-end space-x-3 border-t border-neutral-200">
                <button
                  type="button"
                  className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
                  onClick={closeClientModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  {selectedClient ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h3 className="text-lg font-medium text-red-600">Delete Client</h3>
            </div>

            <div className="p-6">
              <p className="mb-4">
                Are you sure you want to delete <span className="font-medium">{selectedClient.firstName} {selectedClient.lastName}</span>?
                This action cannot be undone.
              </p>

              <p className="text-neutral-500 text-sm">
                All appointment history associated with this client will also be deleted.
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
                onClick={handleDeleteClient}
              >
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
