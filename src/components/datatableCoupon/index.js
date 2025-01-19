import React, { useState, useEffect } from 'react';
import './CreateCoupons.css';
import { BASE_URL } from '../../utils/headers';

const CreateCoupons = () => {
  const [couponData, setCouponData] = useState({
    code: '',
    discount: '',
    influencerEmail: '',
    applicableTours: 'all', // 'all' or 'specific'
    specificTours: '', // comma-separated UUIDs for specific tours
  });
  const [coupons, setCoupons] = useState([]); // List of coupons
  const [loading, setLoading] = useState(false);



  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/createCoupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      if (response.ok) {
        alert('Coupon created successfully!');
        setCouponData({
          code: '',
          discount: '',
          influencerEmail: '',
          applicableTours: 'all',
          specificTours: '',
        });
        fetchCoupons(); // Refresh the list of coupons
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the list of coupons
  const fetchCoupons = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/getCoupons`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      } else {
        console.error('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a coupon
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Coupon deleted successfully!');
        fetchCoupons(); // Refresh the list
      } else {
        alert('Failed to delete coupon.');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="coupon-page">
      <h2>Create Coupon</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Coupon Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={couponData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount (%):</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={couponData.discount}
            onChange={handleChange}
            required
            min="1"
            max="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="influencerEmail">Influencer Email:</label>
          <input
            type="email"
            id="influencerEmail"
            name="influencerEmail"
            value={couponData.influencerEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="applicableTours">Apply Coupon To:</label>
          <select
            id="applicableTours"
            name="applicableTours"
            value={couponData.applicableTours}
            onChange={handleChange}
          >
            <option value="all">All Tours</option>
            <option value="specific">Specific Tours</option>
          </select>
        </div>
        {couponData.applicableTours === 'specific' && (
          <div className="form-group">
            <label htmlFor="specificTours">Enter Tour IDs (comma-separated):</label>
            <input
              type="text"
              id="specificTours"
              name="specificTours"
              value={couponData.specificTours}
              onChange={handleChange}
            />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>

      <h2>Existing Coupons</h2>
      {loading && <p>Loading coupons...</p>}
      {!loading && coupons.length === 0 && <p>No coupons found.</p>}
      <ul className="coupon-list">
        {coupons.map((coupon) => (
          <li key={coupon.id} className="coupon-item">
            <p><strong>Code:</strong> {coupon.code}</p>
            <p><strong>Discount:</strong> {coupon.discount}%</p>
            <p><strong>Influencer Email:</strong> {coupon.influencerEmail}</p>
            <p><strong>Applicable Tours:</strong> {coupon.applicableTours}</p>
            <button onClick={() => handleDelete(coupon.id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateCoupons;
