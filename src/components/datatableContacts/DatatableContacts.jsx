import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils/headers';
import './DatatableContacts.css';
import { toast,Toaster } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

const DatatableContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/getAllContacts`);
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        setContacts(data.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch contacts');
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleMarkAsRead = async (id, currentStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/api/markAsReadOrUnread`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, readStatus: !currentStatus }),  
      });

      const result = await response.json();
      if (result.success) {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === id ? { ...contact, read: !currentStatus } : contact
          )
        );
        toast.success(`Marked as ${!currentStatus ? 'Read' : 'Unread'}!`);
      } else {
        toast.error('Failed to update status.');
      }
    } catch (error) {
      console.error('Error updating read status:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <CircularProgress size={50} color="primary" />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="table-container">
      <Toaster position="top-right" autoClose={3000} />
      <h2 className="table-title">Contact List</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody   >
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact._id}  className={`query-card ${contact.read ? 'read' : ''}`}>
                <td>{contact.fullName}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.message}</td>
                <td>{contact.createdAt}</td>
                <td className="contact-actions">
                  {/* Separate buttons for Mark as Read and Mark as Unread */}
                  {!contact.read ? (
                    <button
                      onClick={() => handleMarkAsRead(contact._id, contact.read)}
                      className="btn-read"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsRead(contact._id, contact.read)}
                      className="btn-unread"
                    >
                      Mark as Unread
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No contacts found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DatatableContacts;
