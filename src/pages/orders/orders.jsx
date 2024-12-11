import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './orders.css';


import { BASE_URL } from '../../utils/headers';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
const NewBlog = ({ title }) => {
   
    const [orders,setOrders]=useState('')
  
    const fetchAllOrders = async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/getOrder`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const orderData = await response.json();
          setOrders(orderData?.data);
   
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
    
      useEffect(() => {
        fetchAllOrders();
      }, []);
      console.log(orders);
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
          </tr>
        </thead>
        <tbody>
          {orders && orders.map(order => (
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
                    <p>Details:</p>
                    <ul>
                      {/* {room.details.map((person, idx) => (
                        <li key={idx}>
                          {person.firstName} {person.lastName}
                        </li>
                      ))} */}
                    </ul>
                  </div>
                ))}
              </td>
              <td>{order.totalPrice.toFixed(2)}</td>
              <td>{order.address}</td>
              <td>{order.mobile}</td>
              <td>{order.email}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
            </div>
        </div>
    );
};

export default NewBlog;





