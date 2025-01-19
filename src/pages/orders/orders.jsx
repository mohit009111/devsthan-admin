import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './orders.css';
import { BASE_URL } from '../../utils/headers';
import { toast, ToastContainer } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';
import {

  CircularProgress,
} from "@mui/material";

const NewBlog = ({ title }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/getOrder`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const orderData = await response.json();
      setOrders(orderData?.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`${BASE_URL}/api/updateOrderStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: selectedOrder._id, status: actionType }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      const updatedOrder = await response.json();
      toast.success(`Order ${actionType} successfully!`);

      // Update the local state to reflect the status change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id ? { ...order, status: actionType } : order
        )
      );
      closeModal();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const openModal = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setActionType('');
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title || 'Create New Blog'}</h1>
        </div>
        <div className="order-details-admin">
          <h1>Order Details</h1>
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Username</th>
                <th>Tour ID</th>
                <th>Category</th>
                <th>Rooms</th>
                <th>Total Price</th>
                <th>Address</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <div className="loader">
                      <CircularProgress />
                </div>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.username}</td>
                    <td>{order.tourId}</td>
                    <td>{order.category}</td>
                    <td>
                      {order.rooms.map((room, index) => (
                        <div key={index}>
                          <p>Room {room.room}:</p>
                          <p>Adults: {room.adults}</p>
                          <p>Children: {room.children}</p>
                        </div>
                      ))}
                    </td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>{order.address}</td>
                    <td>{order.mobile}</td>
                    <td>{order.email}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => openModal(order, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => openModal(order, 'Rejected')}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div className="modal">
            <div className="modal-content">
              <h3>Are you sure?</h3>
              <p>
                Do you want to {actionType.toLowerCase()} the order for{' '}
                <strong>{selectedOrder.username}</strong>?
              </p>
              <div className="modal-actions">
                <button className="confirm-btn" onClick={updateOrderStatus}>
                  Yes, {actionType}
                </button>
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewBlog;
