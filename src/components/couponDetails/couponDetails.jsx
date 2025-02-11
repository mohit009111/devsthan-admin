import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import './CouponDetails.css';
import { BASE_URL } from '../../utils/headers';

const CouponDetails = () => {
  const { id } = useParams(); // Get the coupon code (id) from the route params
  const [coupons, setCoupons] = useState([]); // State to hold an array of coupons
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To handle any fetch errors

  useEffect(() => {
    const fetchCouponDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const response = await fetch(`${BASE_URL}/api/getSingleCoupon/${id}`); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch coupon details.');
        }
        const data = await response.json();

        setCoupons(data.data || []); // Assume the API returns `data.data` as an array
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };

    fetchCouponDetails();
  }, [id]); // Dependency on `id`

  if (loading) {
    return <div className="coupon-loading">Loading...</div>;
  }

  if (error) {
    return <div className="coupon-error">{error}</div>;
  }

  if (coupons.length === 0) {
    return <div className="coupon-error">No coupons found for the given code.</div>;
  }

  return (
    <div className="coupon-container">
      <h1 className="coupon-header">Coupons Details</h1>
      {coupons.map((coupon, index) => (
        <div key={coupon._id} className="coupon-details">
          <h2 className="coupon-code">Coupon Code: {coupon.couponCode}</h2>
          <p className="coupon-info">
            <strong>Discount Applied:</strong> Rs. {coupon.discountApplied}
          </p>
          <p className="coupon-info">
            <strong>Used At:</strong> {new Date(coupon.usedAt).toLocaleString()}
          </p>

          <h3 className="coupon-subheader">Tour Information</h3>
          <p className="coupon-info">
            <strong>Tour Name:</strong> {coupon.tourName}
          </p>

          <h3 className="coupon-subheader">User Details</h3>
          <p className="coupon-info">
            <strong>User Email:</strong> {coupon.userEmail}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CouponDetails;
