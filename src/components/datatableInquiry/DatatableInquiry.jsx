import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils/headers';
import './DatatableInquiry.css'; // Import the CSS file directly

const DatatableContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/getAllInquiries`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();

        const inquiriesWithTourNames = await Promise.all(
          data.data.map(async (contact) => {
            console.log(contact)
            const tourResponse = await fetch(`${BASE_URL}/api/getTour/${contact.uuid}`);
            const tourData = await tourResponse.json();
            console.log(tourData)
            return {
              ...contact,
              tourName: tourData[0].name,
            };
          })
        );
        setContacts(inquiriesWithTourNames);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch contacts');
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  if (loading) {
    return <p>Loading Inquiries...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="table-container">
      <h2 className="table-title">Inquiry List</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Tour Name </th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Message</th>
            <th>Created At</th>

          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <tr key={index}>
                <td>{contact.tourName}</td>
                <td>{contact.fullName}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.message}</td>
                <td>{contact.createdAt}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No contacts found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DatatableContacts;
