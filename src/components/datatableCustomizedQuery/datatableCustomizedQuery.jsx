import React, { useEffect, useState } from 'react';
import './customizedQueries.css';
import { BASE_URL } from '../../utils/headers';
import { toast, Toaster } from 'react-hot-toast';
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

const DatatableCustomizedQuery = () => {
    const [queries, setQueries] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // State to manage loader visibility

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                setLoading(true); // Show loader when the fetch starts
                const response = await fetch(`${BASE_URL}/api/getAllCustomizedQuery`);
                if (!response.ok) throw new Error('Failed to fetch queries');
                const data = await response.json();
                setQueries(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // Hide loader after fetch completes
            }
        };
        fetchQueries();
    }, []);

    const handleMarkAsRead = async (id, currentStatus) => {
        console.log('Marking as read/unread for ID:', id, 'Current Status:', currentStatus); // Debug log
        try {
            const newReadStatus = currentStatus ? false : true;

            const response = await fetch(`${BASE_URL}/api/customizedQuery/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ read: newReadStatus }),
            });

            const result = await response.json();
            if (response.ok && result.success) {
                setQueries((prevQueries) =>
                    prevQueries.map((query) =>
                        query._id === id ? { ...query, read: newReadStatus } : query
                    )
                );
                toast.success(
                    `Query marked as ${newReadStatus ? 'Read' : 'Unread'} successfully!`
                );
            } else {
                toast.error('Failed to update query status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating query status:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="query-container">
            <Toaster position="top-right" autoClose={3000} />
            <h2>Customized Queries</h2>

            {loading ? (
                <div className="loader">
                    <CircularProgress size={50} color="primary" />
                </div>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="query-grid">
                    {queries.map((query) => (
                        <div
                            key={query._id}
                            className={`query-card ${query.read ? 'read' : ''}`}
                        >
                            <div className="query-header">
                                <h3>{query.name}</h3>
                                <span>{new Date(query.submittedAt).toLocaleString()}</span>
                            </div>
                            <p><strong>Name:</strong> {query.name}</p>
                            <p><strong>Email:</strong> {query.email}</p>
                            <p><strong>Mobile:</strong> {query.mobileNumber}</p>
                            <p><strong>Destination:</strong> {query.query}</p>
                            <p><strong>Adults:</strong> {query.noOfAdult}</p>
                            <p><strong>Children:</strong> {query.noOfChild}</p>
                            <div className="query-actions">
                                {!query.read ? (
                                    <button
                                        onClick={() => handleMarkAsRead(query._id, false)}
                                        className="btn-read"
                                    >
                                        Mark as Read
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleMarkAsRead(query._id, true)}
                                        className="btn-unread"
                                    >
                                        Mark as Unread
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DatatableCustomizedQuery;
